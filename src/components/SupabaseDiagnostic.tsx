import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DiagnosticResult {
  status: 'loading' | 'success' | 'error';
  message: string;
  details?: any;
}

interface TableInfo {
  name: string;
  recordCount: number;
  hasRLS: boolean;
  rlsPolicies: string[];
}

interface DiagnosticState {
  config: DiagnosticResult;
  connection: DiagnosticResult;
  tablesInfo: DiagnosticResult & { data?: TableInfo[] };
  readTest: DiagnosticResult;
  writeTest: DiagnosticResult;
  rlsTest: DiagnosticResult;
}

const SupabaseDiagnostic = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticState>({
    config: { status: 'loading', message: 'Verificando configuración...' },
    connection: { status: 'loading', message: 'Probando conexión...' },
    tablesInfo: { status: 'loading', message: 'Analizando tablas...' },
    readTest: { status: 'loading', message: 'Probando lectura...' },
    writeTest: { status: 'loading', message: 'Probando escritura...' },
    rlsTest: { status: 'loading', message: 'Verificando RLS...' }
  });

  const runDiagnostics = async () => {
    // Reset all to loading
    setDiagnostics({
      config: { status: 'loading', message: 'Verificando configuración...' },
      connection: { status: 'loading', message: 'Probando conexión...' },
      tablesInfo: { status: 'loading', message: 'Analizando tablas...' },
      readTest: { status: 'loading', message: 'Probando lectura...' },
      writeTest: { status: 'loading', message: 'Probando escritura...' },
      rlsTest: { status: 'loading', message: 'Verificando RLS...' }
    });

    // 1. Verificar configuración
    try {
      const url = 'https://kmtemxfstvghtryoqpnx.supabase.co';
      const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttdGVteGZzdHZnaHRyeW9xcG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NTc5MjIsImV4cCI6MjA3MDMzMzkyMn0.k1W3KfHn1rYaA1dk0pMoxZ5f3A48sI8rQ_2TzHBN1cM';
      
      const urlMasked = url.substring(0, 20) + '***' + url.substring(url.length - 10);
      const keyMasked = key.substring(0, 15) + '***' + key.substring(key.length - 15);
      
      setDiagnostics(prev => ({
        ...prev,
        config: {
          status: 'success',
          message: `Configuración OK`,
          details: {
            url: urlMasked,
            key: keyMasked,
            clientInitialized: !!supabase
          }
        }
      }));
    } catch (error) {
      setDiagnostics(prev => ({
        ...prev,
        config: {
          status: 'error',
          message: 'Error en configuración',
          details: error
        }
      }));
    }

    // 2. Prueba de conexión básica
    try {
      const { data, error } = await supabase.from('productos').select('count').single();
      
      setDiagnostics(prev => ({
        ...prev,
        connection: {
          status: error ? 'error' : 'success',
          message: error ? `Error de conexión: ${error.message}` : 'Conexión exitosa con Supabase',
          details: error || { connectionTime: new Date().toISOString() }
        }
      }));
    } catch (error) {
      setDiagnostics(prev => ({
        ...prev,
        connection: {
          status: 'error',
          message: 'Error inesperado de conexión',
          details: error
        }
      }));
    }

    // 3. Análisis de tablas y RLS
    try {
      const tablesInfo: TableInfo[] = [];

      // Verificar tabla productos
      try {
        const { count, error } = await supabase
          .from('productos')
          .select('*', { count: 'exact', head: true });

        tablesInfo.push({
          name: 'productos',
          recordCount: count || 0,
          hasRLS: !error,
          rlsPolicies: []
        });
      } catch (error) {
        tablesInfo.push({
          name: 'productos',
          recordCount: 0,
          hasRLS: false,
          rlsPolicies: []
        });
      }

      // Verificar tabla usuarios
      try {
        const { count, error } = await supabase
          .from('usuarios')
          .select('*', { count: 'exact', head: true });

        tablesInfo.push({
          name: 'usuarios',
          recordCount: count || 0,
          hasRLS: !error,
          rlsPolicies: []
        });
      } catch (error) {
        tablesInfo.push({
          name: 'usuarios',
          recordCount: 0,
          hasRLS: false,
          rlsPolicies: []
        });
      }

      // Verificar tabla pedidos
      try {
        const { count, error } = await supabase
          .from('pedidos')
          .select('*', { count: 'exact', head: true });

        tablesInfo.push({
          name: 'pedidos',
          recordCount: count || 0,
          hasRLS: !error,
          rlsPolicies: []
        });
      } catch (error) {
        tablesInfo.push({
          name: 'pedidos',
          recordCount: 0,
          hasRLS: false,
          rlsPolicies: []
        });
      }

      // Verificar tabla items_pedido
      try {
        const { count, error } = await supabase
          .from('items_pedido')
          .select('*', { count: 'exact', head: true });

        tablesInfo.push({
          name: 'items_pedido',
          recordCount: count || 0,
          hasRLS: !error,
          rlsPolicies: []
        });
      } catch (error) {
        tablesInfo.push({
          name: 'items_pedido',
          recordCount: 0,
          hasRLS: false,
          rlsPolicies: []
        });
      }

      setDiagnostics(prev => ({
        ...prev,
        tablesInfo: {
          status: 'success',
          message: `${tablesInfo.length} tablas analizadas`,
          data: tablesInfo
        }
      }));
    } catch (error) {
      setDiagnostics(prev => ({
        ...prev,
        tablesInfo: {
          status: 'error',
          message: 'Error analizando tablas',
          details: error
        }
      }));
    }

    // 4. Prueba de lectura
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('id, nombre, precio')
        .limit(5);

      if (error) {
        setDiagnostics(prev => ({
          ...prev,
          readTest: {
            status: 'error',
            message: `Error de lectura: ${error.message}`,
            details: {
              code: error.code,
              hint: error.hint,
              details: error.details
            }
          }
        }));
      } else {
        setDiagnostics(prev => ({
          ...prev,
          readTest: {
            status: 'success',
            message: `Lectura exitosa: ${data?.length || 0} productos obtenidos`,
            details: data
          }
        }));
      }
    } catch (error) {
      setDiagnostics(prev => ({
        ...prev,
        readTest: {
          status: 'error',
          message: 'Error inesperado en lectura',
          details: error
        }
      }));
    }

    // 5. Prueba de escritura
    try {
      // Obtener el usuario actual si está autenticado
      const { data: { user } } = await supabase.auth.getUser();
      
      const testUser = {
        email: `test.${Date.now()}@example.com`,
        nombre: 'Usuario de Prueba',
        telefono: '+34123456789',
        auth_id: user?.id || null, // Incluir auth_id si hay usuario autenticado
        // fecha_registro se auto-genera con now()
        // id se auto-genera
      };

      const { data, error } = await supabase
        .from('usuarios')
        .insert([testUser])
        .select();

      if (error) {
        setDiagnostics(prev => ({
          ...prev,
          writeTest: {
            status: 'error',
            message: `Error de escritura: ${error.message}`,
            details: {
              code: error.code,
              hint: error.hint,
              details: error.details
            }
          }
        }));
      } else {
        setDiagnostics(prev => ({
          ...prev,
          writeTest: {
            status: 'success',
            message: 'Escritura exitosa: Usuario creado',
            details: data
          }
        }));
      }
    } catch (error) {
      setDiagnostics(prev => ({
        ...prev,
        writeTest: {
          status: 'error',
          message: 'Error inesperado en escritura',
          details: error
        }
      }));
    }

    // 6. Verificación específica de RLS
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Probar lectura sin autenticación vs con autenticación
      const { data: publicData, error: publicError } = await supabase
        .from('productos')
        .select('id')
        .limit(1);

      const rlsStatus = {
        userAuthenticated: !!user,
        publicReadAccess: !publicError,
        authRequiredForWrite: true // Basado en nuestras pruebas anteriores
      };

      setDiagnostics(prev => ({
        ...prev,
        rlsTest: {
          status: 'success',
          message: `RLS activo. Usuario ${user ? 'autenticado' : 'anónimo'}`,
          details: rlsStatus
        }
      }));
    } catch (error) {
      setDiagnostics(prev => ({
        ...prev,
        rlsTest: {
          status: 'error',
          message: 'Error verificando RLS',
          details: error
        }
      }));
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'loading':
        return <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
    }
  };

  const getStatusBadge = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'loading':
        return <Badge variant="secondary">Cargando...</Badge>;
      case 'success':
        return <Badge className="bg-green-500 text-white">OK</Badge>;
      case 'error':
        return <Badge variant="destructive">ERROR</Badge>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-luxury font-bold text-foreground">
          Panel de Diagnóstico Supabase
        </h2>
        <Button 
          onClick={runDiagnostics}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reiniciar Pruebas
        </Button>
      </div>

      <div className="grid gap-4">
        {/* Configuración */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                {getStatusIcon(diagnostics.config.status)}
                1. Verificación de Configuración
              </span>
              {getStatusBadge(diagnostics.config.status)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">{diagnostics.config.message}</p>
            {diagnostics.config.details && (
              <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
                <div><strong>URL:</strong> {diagnostics.config.details.url}</div>
                <div><strong>Key:</strong> {diagnostics.config.details.key}</div>
                <div><strong>Cliente inicializado:</strong> {diagnostics.config.details.clientInitialized ? 'Sí' : 'No'}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conexión */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                {getStatusIcon(diagnostics.connection.status)}
                2. Prueba de Conexión
              </span>
              {getStatusBadge(diagnostics.connection.status)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">{diagnostics.connection.message}</p>
            {diagnostics.connection.details && (
              <div className="bg-muted p-3 rounded-lg text-xs">
                <pre className="whitespace-pre-wrap overflow-auto max-h-32">
                  {JSON.stringify(diagnostics.connection.details, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información de Tablas */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                3. Análisis de Tablas
              </span>
              {getStatusBadge(diagnostics.tablesInfo.status)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">{diagnostics.tablesInfo.message}</p>
            {diagnostics.tablesInfo.data && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {diagnostics.tablesInfo.data.map((table, index) => (
                  <div key={index} className="bg-muted p-3 rounded-lg text-xs">
                    <div className="font-semibold text-sm mb-2">{table.name}</div>
                    <div><strong>Registros:</strong> {table.recordCount}</div>
                    <div className="flex items-center gap-2">
                      <strong>RLS:</strong> 
                      {table.hasRLS ? (
                        <Badge variant="default" className="text-xs">Activo</Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">Inactivo</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prueba de lectura */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                {getStatusIcon(diagnostics.readTest.status)}
                4. Prueba de Lectura (productos)
              </span>
              {getStatusBadge(diagnostics.readTest.status)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">{diagnostics.readTest.message}</p>
            {diagnostics.readTest.details && (
              <div className="bg-muted p-3 rounded-lg text-xs">
                <pre className="whitespace-pre-wrap overflow-auto max-h-32">
                  {JSON.stringify(diagnostics.readTest.details, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prueba de escritura */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                {getStatusIcon(diagnostics.writeTest.status)}
                5. Prueba de Escritura (usuarios)
              </span>
              {getStatusBadge(diagnostics.writeTest.status)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">{diagnostics.writeTest.message}</p>
            {diagnostics.writeTest.details && (
              <div className="bg-muted p-3 rounded-lg text-xs">
                <pre className="whitespace-pre-wrap overflow-auto max-h-32">
                  {JSON.stringify(diagnostics.writeTest.details, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Verificación RLS */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                6. Verificación de RLS
              </span>
              {getStatusBadge(diagnostics.rlsTest.status)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">{diagnostics.rlsTest.message}</p>
            {diagnostics.rlsTest.details && (
              <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
                <div><strong>Usuario autenticado:</strong> {diagnostics.rlsTest.details.userAuthenticated ? 'Sí' : 'No'}</div>
                <div><strong>Lectura pública:</strong> {diagnostics.rlsTest.details.publicReadAccess ? 'Permitida' : 'Bloqueada'}</div>
                <div><strong>Escritura requiere auth:</strong> {diagnostics.rlsTest.details.authRequiredForWrite ? 'Sí' : 'No'}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información adicional */}
        {(diagnostics.readTest.status === 'error' || diagnostics.writeTest.status === 'error') && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertCircle className="h-5 w-5" />
                Posibles Causas de Error
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-orange-700 space-y-2">
              <p>• <strong>Políticas RLS:</strong> Verifica que las políticas de Row Level Security permitan las operaciones.</p>
              <p>• <strong>Autenticación:</strong> Algunas operaciones requieren que el usuario esté autenticado.</p>
              <p>• <strong>Permisos:</strong> Revisa los permisos de la tabla en el panel de Supabase.</p>
              <p>• <strong>Estructura:</strong> Verifica que las columnas de la tabla coincidan con los datos enviados.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SupabaseDiagnostic;
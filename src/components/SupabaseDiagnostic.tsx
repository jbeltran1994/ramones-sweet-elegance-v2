import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DiagnosticResult {
  status: 'loading' | 'success' | 'error';
  message: string;
  details?: any;
}

interface DiagnosticState {
  config: DiagnosticResult;
  readTest: DiagnosticResult;
  writeTest: DiagnosticResult;
}

const SupabaseDiagnostic = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticState>({
    config: { status: 'loading', message: 'Verificando configuración...' },
    readTest: { status: 'loading', message: 'Probando lectura...' },
    writeTest: { status: 'loading', message: 'Probando escritura...' }
  });

  const runDiagnostics = async () => {
    // Reset all to loading
    setDiagnostics({
      config: { status: 'loading', message: 'Verificando configuración...' },
      readTest: { status: 'loading', message: 'Probando lectura...' },
      writeTest: { status: 'loading', message: 'Probando escritura...' }
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

    // 2. Prueba de lectura
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

    // 3. Prueba de escritura
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

        {/* Prueba de lectura */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                {getStatusIcon(diagnostics.readTest.status)}
                2. Prueba de Lectura (productos)
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
                3. Prueba de Escritura (usuarios)
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
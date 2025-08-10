import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useChatbase } from '@/hooks/useChatbase';
import { useToast } from '@/hooks/use-toast';
import { Bot, Settings, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';

const ChatbaseSettings = () => {
  const { chatbotId, secretKey, isEnabled, isLoading, error, updateChatbotId, updateSecretKey, toggleEnabled } = useChatbase();
  const [newChatbotId, setNewChatbotId] = useState(chatbotId || '');
  const [newSecretKey, setNewSecretKey] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveChatbotId = async () => {
    if (!newChatbotId.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un ID de chatbot válido",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      await updateChatbotId(newChatbotId.trim());
      toast({
        title: "Configuración guardada",
        description: "El ID del chatbot ha sido actualizado correctamente",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSecretKey = async () => {
    if (!newSecretKey.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa una clave secreta válida",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      await updateSecretKey(newSecretKey.trim());
      setNewSecretKey(''); // Limpiar el campo por seguridad
      toast({
        title: "Clave secreta guardada",
        description: "La clave secreta ha sido actualizada correctamente",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo guardar la clave secreta",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEnabled = async (enabled: boolean) => {
    try {
      await toggleEnabled(enabled);
      toast({
        title: enabled ? "Chatbase activado" : "Chatbase desactivado",
        description: enabled 
          ? "El widget de Chatbase ahora está visible en el sitio web"
          : "El widget de Chatbase ha sido ocultado del sitio web",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado de Chatbase",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Configuración de Chatbase
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-2">Cargando configuración...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <CardTitle>Configuración de Chatbase</CardTitle>
            </div>
            <Badge variant={isEnabled ? "default" : "secondary"}>
              {isEnabled ? "Activo" : "Inactivo"}
            </Badge>
          </div>
          <CardDescription>
            Configura e integra tu chatbot de Chatbase en el sitio web
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Activar Chatbase</Label>
                <p className="text-xs text-muted-foreground">
                  Mostrar el widget de chat en el sitio web
                </p>
              </div>
              <Switch
                checked={isEnabled}
                onCheckedChange={handleToggleEnabled}
                disabled={!chatbotId}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="chatbotId">ID del Chatbot</Label>
              <div className="flex gap-2">
                <Input
                  id="chatbotId"
                  value={newChatbotId}
                  onChange={(e) => setNewChatbotId(e.target.value)}
                  placeholder="Ej: tu-chatbot-id-aqui"
                  className="flex-1"
                />
                <Button 
                  onClick={handleSaveChatbotId}
                  disabled={saving || newChatbotId === chatbotId}
                  variant="outline"
                >
                  {saving ? "Guardando..." : "Guardar"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Encuentra tu ID de chatbot en el panel de Chatbase
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <Label htmlFor="secretKey">Clave Secreta (Opcional pero Recomendada)</Label>
                <div className="flex gap-2">
                  <Input
                    id="secretKey"
                    type="password"
                    value={newSecretKey}
                    onChange={(e) => setNewSecretKey(e.target.value)}
                    placeholder="Ingresa tu secret key de Chatbase"
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSaveSecretKey}
                    disabled={saving || !newSecretKey.trim()}
                    variant="outline"
                  >
                    {saving ? "Guardando..." : "Guardar"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  La secret key permite identity verification y funciones avanzadas como análisis de usuarios
                </p>
                {secretKey && (
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <p className="text-xs text-green-600">
                      Clave secreta configurada correctamente
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {chatbotId && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <div>Chatbot configurado correctamente. ID: <code className="bg-muted px-1 rounded">{chatbotId}</code></div>
                  {secretKey && <div className="text-sm">• Clave secreta configurada</div>}
                  <div className="text-sm">• Domain: <code className="bg-muted px-1 rounded">{window.location.hostname}</code></div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Alert variant="default" className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>¿No aparece el widget?</strong> Asegúrate de que:
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>El chatbot esté marcado como "público" en Chatbase</li>
                <li>El ID del chatbot sea correcto (sin espacios extra)</li>
                <li>Hayas guardado la configuración y activado el switch</li>
                <li>No tengas bloqueadores de script activos</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Instrucciones de Configuración
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">1</div>
              <div>
                <p className="font-medium">Crea tu chatbot en Chatbase</p>
                <p className="text-sm text-muted-foreground">
                  Ve a <a href="https://www.chatbase.co" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                    chatbase.co <ExternalLink className="h-3 w-3" />
                  </a> y crea tu chatbot
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">2</div>
              <div>
                <p className="font-medium">Obtén tu ID de chatbot y script de embed</p>
                <p className="text-sm text-muted-foreground">
                  En tu dashboard de Chatbase, ve a la sección "Connect" → "Embed" y copia el ID de tu chatbot
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">3</div>
              <div>
                <p className="font-medium">Configura la clave secreta (opcional)</p>
                <p className="text-sm text-muted-foreground">
                  Para identity verification, agrega tu secret key desde el panel de Chatbase
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">4</div>
              <div>
                <p className="font-medium">Activa el widget</p>
                <p className="text-sm text-muted-foreground">
                  Guarda los cambios y activa el switch para que aparezca en tu sitio web
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbaseSettings;
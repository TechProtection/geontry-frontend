import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Función para crear perfil después del registro exitoso  
  const createUserProfile = async (userId: string, userData: { email: string; full_name: string }) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          email: userData.email,
          full_name: userData.full_name,
          role: 'USER',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        // Si el perfil ya existe, es OK
        if (error.code !== '23505') { // 23505 = unique violation
          throw error;
        }
        console.log('Profile already exists, skipping creation');
      } else {
        console.log('Profile created successfully:', data);
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
      // No lanzar error aquí para no interrumpir el flujo de registro
    }
  };  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Validaciones básicas
        if (!fullName.trim()) {
          throw new Error("El nombre completo es requerido");
        }
        
        if (password.length < 6) {
          throw new Error("La contraseña debe tener al menos 6 caracteres");
        }

        // Registro con Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim()
            }
          }
        });

        if (authError) throw authError;
        
        // Si el usuario fue creado exitosamente
        if (authData.user) {
          // Intentar crear el perfil inmediatamente (para usuarios confirmados automáticamente)
          if (authData.user.email_confirmed_at) {
            await createUserProfile(authData.user.id, {
              email: email.trim(),
              full_name: fullName.trim()
            });
            
            toast({
              title: "Registro exitoso",
              description: "Tu cuenta ha sido creada. Redirigiendo...",
            });
            
            // Esperar un momento para que el contexto se actualice
            setTimeout(() => {
              navigate("/");
            }, 1000);
          } else {
            toast({
              title: "Confirma tu email",
              description: "Por favor verifica tu correo electrónico para activar tu cuenta.",
            });
          }
        }
        
        // Resetear formulario
        setEmail("");
        setPassword("");
        setFullName("");
        
      } else {
        // Inicio de sesión
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;
        
        // Si el usuario se autenticó pero no tiene perfil, crearlo
        if (data.user) {
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', data.user.id)
            .single();
          
          if (!existingProfile) {
            await createUserProfile(data.user.id, {
              email: data.user.email || email.trim(),
              full_name: data.user.user_metadata?.full_name || email.split('@')[0]
            });
          }
        }
        
        toast({
          title: "Bienvenido",
          description: "Has iniciado sesión correctamente.",
        });
        
        navigate("/");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      
      let errorMessage = "Ocurrió un error durante la autenticación";
      
      // Manejar errores específicos
      if (error.message.includes("Email not confirmed")) {
        errorMessage = "Por favor confirma tu correo electrónico antes de iniciar sesión.";
      } else if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Credenciales incorrectas. Verifica tu email y contraseña.";
      } else if (error.message.includes("User already registered")) {
        errorMessage = "Este email ya está registrado. Intenta iniciar sesión.";
      } else if (error.message.includes("Email address is already")) {
        errorMessage = "Este email ya está registrado. Intenta iniciar sesión.";
      } else if (error.message.includes("Password should be at least")) {
        errorMessage = "La contraseña debe tener al menos 6 caracteres.";
      } else if (error.message.includes("Invalid email")) {
        errorMessage = "Por favor ingresa un email válido.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForceReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-4">
        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader className="space-y-2 pb-4">
            <div className="flex justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-blue-500"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <CardTitle className="text-2xl text-center">GeoEntry</CardTitle>
            <CardDescription className="text-zinc-400 text-center">
              {isSignUp ? "Crea una cuenta nueva" : "Inicia sesión en tu cuenta"}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleAuth}>
            <CardContent className="space-y-4">              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-zinc-300">
                    Nombre completo
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={isSignUp}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Tu nombre completo"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="nombre@ejemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-zinc-800 border-zinc-700 text-white"
                  placeholder="••••••••"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Procesando..." : isSignUp ? "Registrarse" : "Iniciar sesión"}
              </Button>
              <p className="text-sm text-center text-zinc-400">
                {isSignUp ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-500 hover:underline"
                >
                  {isSignUp ? "Inicia sesión" : "Regístrate"}
                </button>
              </p>
            </CardFooter>
          </form>
        </Card>
        {loading && (
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <p className="mb-1">¿Problemas al cargar?</p>
            <button 
              onClick={handleForceReset}
              className="text-blue-500 hover:underline"
            >
              Reiniciar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
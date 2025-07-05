import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Registro
        await signUp(email, password, username);
        toast({
          title: "Registro exitoso",
          description: "Por favor verifica tu correo electrónico para confirmar tu cuenta.",
        });
      } else {
        // Inicio de sesión
        await signIn(email, password);
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error durante la autenticación",
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
            <CardContent className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-zinc-300">
                    Nombre de usuario
                  </Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={isSignUp}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="nombre_usuario"
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
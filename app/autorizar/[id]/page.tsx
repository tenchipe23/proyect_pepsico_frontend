// This is a Client Component
"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { usePase } from "@/context/pase-context"
import { PaseData } from "@/context/pase-context"
import SignaturePad from "@/components/signature-pad"
import SealUpload from "@/components/seal-upload"
import PdfExport from "@/components/pdf-export"
import { PenIcon, StampIcon, CheckIcon, EditIcon, SaveIcon, AlertCircleIcon, XCircleIcon, TrashIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import AppHeader from "@/components/app-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import AuthRedirect from "@/components/auth-redirect"
import { useRouter, useParams } from "next/navigation"
import BackButton from "@/components/back-button"
import LoadingIndicator from "@/components/loading-indicator"
import NavigationGuard from "@/components/navigation-guard"

// This is the client component that will be rendered
export default function AutorizarPageWrapper() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id
  
  if (!id) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingIndicator />
      </div>
    )
  }
  
  return <AutorizarPageClient id={id} />
}

// Client component that receives the id as a prop
function AutorizarPageClient({ id }: { id: string }) {
  const { getPaseById, updatePase, signPase, authorizePase, rejectPase, deletePase } = usePase()
  const { toast } = useToast()
  const formRef = useRef<HTMLDivElement>(null)
  const pdfExportRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState<"firma" | "sello" | null>(null)
  const [signatureData, setSignatureData] = useState<string | null>(null)
  const [sealData, setSealData] = useState<string | null>(null)
  const [pase, setPase] = useState<PaseData | undefined>(undefined)
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState<Partial<any>>({})
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [preventRedirect, setPreventRedirect] = useState(false)
  const [isSecurityUser, setIsSecurityUser] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const modifyContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter()

  // Load user data first
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        console.log("Usuario cargado:", userData.name, userData.role)
        setUser(userData)
        
        // Establecer flag para usuarios de seguridad
        if (userData.role === "seguridad") {
          setIsSecurityUser(true)
          console.log("Flag de usuario de seguridad establecido")
        }
      } else {
        console.log("No se encontró usuario en localStorage")
      }
    }
  }, [])

  // Load pase data when user and id are available
  useEffect(() => {
    const loadData = async () => {
      if (!user || !id || typeof id !== "string") {
        console.log("Datos insuficientes para cargar:", { user: !!user, id, idType: typeof id })
        return
      }

      console.log("Usuario disponible para cargar pase:", user.name, user.role)

      try {
        setIsLoading(true)
        setLoadError(null)
        
        console.log("Iniciando carga de datos para ID:", id)

        // Check if we're on the dashboard route
        if (id === "dashboard") {
          console.log("Detectada ruta de dashboard como ID de pase, redirigiendo...")
          // Redirect to the correct dashboard route based on user role
          if (user?.role === "admin") {
            router.push("/admin")
          } else if (user?.role === "autorizador") {
            router.push("/autorizar/dashboard")
          } else if (user?.role === "seguridad") {
            router.push("/seguridad")
          } else {
            router.push("/autorizar/dashboard")
          }
          return
        }

        // Para usuarios de seguridad, verificar que el ID sea válido antes de continuar
        if (user?.role === "seguridad") {
          console.log("Usuario de seguridad detectado, verificando ID del pase:", id)
          // Verificar que el ID no sea vacío o inválido
          if (!id || id.trim() === "" || id === "undefined" || id === "null") {
            console.log("ID de pase inválido para usuario de seguridad, redirigiendo al panel")
            router.push("/seguridad")
            return
          }
        }

        // Load pass data - ahora es asíncrono
        console.log("Intentando cargar pase con ID:", id)
        const paseData = await getPaseById(id)
        console.log("Resultado de getPaseById:", paseData)
        
        if (!paseData) {
          console.log("Pase no encontrado para ID:", id)
          console.log("Usuario que intenta acceder:", user?.role)
          
          // Para usuarios de seguridad, mostrar un mensaje más específico y NO redirigir automáticamente
          if (user?.role === "seguridad") {
            setLoadError(`No se pudo cargar el pase con ID: ${id}. Verifique que el ID sea correcto o contacte al administrador.`)
            console.log("Usuario de seguridad: mostrando error sin redirección automática")
          } else {
            setLoadError(`No se encontró el pase con ID: ${id}`)
          }
          setIsLoading(false)
          return
        }

        console.log("Datos del pase cargados:", paseData.folio)
        setPase(paseData) // Now setting the actual PaseData object, not the Promise

        // Initialize edit form with current data
        if (paseData) {
          setEditFormData({
          razonSocial: paseData.razonSocial,
          fecha: paseData.fecha,
          tractorEco: paseData.tractorEco,
          tractorPlaca: paseData.tractorPlaca,
          remolque1Eco: paseData.remolque1Eco,
          remolque1Placa: paseData.remolque1Placa,
          remolque2Eco: paseData.remolque2Eco,
          remolque2Placa: paseData.remolque2Placa,
          operadorNombre: paseData.operadorNombre,
          operadorApellidoPaterno: paseData.operadorApellidoPaterno,
          operadorApellidoMaterno: paseData.operadorApellidoMaterno,
          ecoDolly: paseData.ecoDolly,
          placasDolly: paseData.placasDolly,
          comentarios: paseData.comentarios,
        })
      }

        setIsLoading(false)
      } catch (error) {
        console.error("Error loading data:", error)
        console.error("Error details:", {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : 'No stack trace',
          id: id,
          userRole: user?.role
        })
        
        // Mensaje de error específico para usuarios de seguridad
        if (user?.role === "seguridad") {
          setLoadError("Error al cargar los datos del pase. Por favor, verifique su conexión e intente nuevamente.")
        } else {
          setLoadError("Error al cargar los datos. Por favor, intente nuevamente.")
        }
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [user, id, getPaseById, router])

  // If there's an error loading the pass
  if (loadError) {
    return (
      <AuthRedirect allowedRoles={["admin", "autorizador", "seguridad"]}>
        <div className="flex flex-col justify-center items-center h-[50vh] gap-4">
          <div className="w-full max-w-md">
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>Error al cargar datos</AlertTitle>
              <AlertDescription>{loadError}</AlertDescription>
            </Alert>
          </div>
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                console.log("Botón 'Reintentar' clickeado por usuario:", user?.role)
                setLoadError(null)
                setIsLoading(true)
                // Recargar la página para intentar de nuevo
                window.location.reload()
              }}
            >
              Reintentar
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                console.log("Botón 'Volver al panel' clickeado por usuario:", user?.role)
                if (user?.role === "admin") {
                  router.push("/admin")
                } else if (user?.role === "autorizador") {
                  router.push("/autorizar/dashboard")
                } else if (user?.role === "seguridad") {
                  router.push("/seguridad")
                } else {
                  // Fallback para roles no reconocidos
                  router.push("/login")
                }
              }}
            >
              Volver al panel
            </Button>
          </div>
        </div>
      </AuthRedirect>
    )
  }

  if (isLoading || !pase) {
    return (
      <AuthRedirect allowedRoles={["admin", "autorizador", "seguridad"]}>
        <div className="flex justify-center items-center h-[50vh]">
          <LoadingIndicator text="Obteniendo información del pase de salida" size="lg" />
        </div>
      </AuthRedirect>
    )
  }

  // Check if the user has permissions to authorize
  const canAuthorize = user?.role === "admin" || user?.role === "autorizador"
  // Check if user is from seguridad
  const isSeguridad = user?.role === "seguridad"
  // Check if the user has permissions to edit - Seguridad solo puede ver
  const canEdit = (user?.role === "admin" || user?.role === "autorizador") && !isSeguridad

  const handleSignatureSave = (signature: string) => {
    // Check if pass is in PENDING state before allowing signature
    if (!isModifying && pase.estado !== 'PENDIENTE') {
      toast({
        variant: "destructive",
        title: "No se puede firmar",
        description: "Solo se pueden firmar pases en estado PENDIENTE",
      });
      return;
    }
    
    setSignatureData(signature);
    setActiveSection('sello'); // Move to seal input after signature
    
    toast({
      variant: "default",
      title: "Firma capturada",
      description: "Ahora ingrese el sello para completar el proceso",
    });
  };

  const handleEditToggle = () => {
    if (isSeguridad) return; // No permitir edición para seguridad
    
    if (isEditing) {
      // Aquí iría la lógica para guardar los cambios
      // Por ahora solo cerramos el modo de edición
      setIsEditing(false);
    } else {
      // Entrar en modo de edición
      setIsEditing(true);
    }
  };

  const handleSealSave = async (seal: string) => {
    // Check if pass is in PENDING state before allowing seal
    if (!isModifying && pase.estado !== 'PENDIENTE') {
      toast({
        variant: "destructive",
        title: "No se puede agregar sello",
        description: "Solo se pueden agregar sellos a pases en estado PENDIENTE",
      });
      return;
    }
    
    setSealData(seal);
    
    try {
      if (!signatureData) {
        throw new Error("Por favor capture primero la firma");
      }
      
      if (isModifying) {
        const updatedPase = { ...pase, firma: signatureData, sello: seal };
    await updatePase(pase.id!, updatedPase);
    setPase(updatedPase);
        toast({
          variant: "default",
          title: "Firma y sello actualizados",
          description: "Los cambios han sido guardados correctamente",
        });
      } else {
        const signatureDataToSave = {
          signature: signatureData,
          seal: seal
        };
        await signPase(pase.id!, signatureDataToSave);
        setPase((prev: PaseData | undefined) => {
          if (!prev) return undefined;
          return {
            ...prev,
            estado: 'FIRMADO',
            firma: signatureData,
            sello: seal,
            fechaFirma: new Date().toISOString()
          };
        });
        toast({
          variant: "default",
          title: "Firma y sello guardados",
          description: "El sello ha sido guardado correctamente",
        });
      }
      
      setSignatureData(null);
      setSealData(null);
      setActiveSection(null);
      setIsModifying(false);

    } catch (error) {
      console.error("Error:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar el sello. Intente nuevamente.",
      })
    }
  }

  const handleAutorizar = async (approve: boolean) => {
    // Verificar que el usuario tenga permisos para autorizar
    if (isSeguridad || isSecurityUser) {
      console.log("Usuario de seguridad intentó autorizar - acción bloqueada")
      toast({
        variant: "destructive",
        title: "Sin permisos",
        description: "Los usuarios de seguridad no pueden autorizar pases",
      })
      return
    }

    // Eliminamos la validación de firma y sello para permitir autorizar pases ya firmados y sellados
    // if (!pase.firma || !pase.sello) {
    //   toast({
    //     variant: "destructive",
    //     title: "Error",
    //     description: "Debe agregar firma y sello para autorizar el pase",
    //   })
    //   return
    // }

    try {
      if (approve) {
        await authorizePase(pase.id!);
        setPase((prev: PaseData | undefined) => {
          if (!prev) return undefined;
          return {
            ...prev,
            estado: "AUTORIZADO",
          };
        });
        toast({
          variant: "default",
          title: "Pase autorizado",
          description: "El pase ha sido autorizado correctamente",
        });
      } else {
        await rejectPase(pase.id!);
        setPase((prev: PaseData | undefined) => {
          if (!prev) return undefined;
          return {
            ...prev,
            estado: "RECHAZADO",
          };
        });
        toast({
          variant: "default",
          title: "Pase rechazado",
          description: "El pase ha sido rechazado correctamente",
        });
      }

      // Redirect based on user role
  if (user?.role === "autorizador") {
    setTimeout(() => {
      router.push("/autorizar/dashboard")
    }, 1500)
  } else if (user?.role === "admin") {
    setTimeout(() => {
      router.push("/admin")
    }, 1500)
  }
    } catch (error) {
      console.error("Error al procesar pase:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo procesar el pase. Intente nuevamente.",
      })
    }
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveEdit = () => {
    try {
      // Ensure the date is properly formatted as ISO string (YYYY-MM-DD)
      // Default to current date if fecha is not provided
      const formattedData = {
        ...editFormData,
        fecha: editFormData.fecha 
          ? new Date(editFormData.fecha).toISOString().split('T')[0] 
          : new Date().toISOString().split('T')[0] // Default to today's date if not provided
      };

      updatePase(pase.id!, formattedData)
      setPase((prev: PaseData | undefined) => {
        if (!prev) return undefined;
        return {
          ...prev,
          ...formattedData,
          fecha: formattedData.fecha // Ensure fecha is always a string
        };
      });
      setIsEditing(false)

      toast({
        variant: "default",
        title: "Cambios guardados",
        description: "Los datos del pase han sido actualizados correctamente",
      })
    } catch (error) {
      console.error("Error al guardar cambios:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron guardar los cambios. Intente nuevamente.",
      })
    }
  }

  const handleBack = () => {
    console.log("handleBack llamado por usuario:", user?.role)
    if (user?.role === "admin") {
      router.push("/admin")
    } else if (user?.role === "autorizador") {
      router.push("/autorizar/dashboard")
    } else if (user?.role === "seguridad") {
      router.push("/seguridad")
    } else {
      // Fallback para roles no reconocidos
      console.warn("Rol de usuario no reconocido:", user?.role)
      router.push("/login")
    }
  }

  const handleDelete = async () => {
    if (!pase.id) return;
    
    // Verificar que el usuario tenga permisos para eliminar
    if (isSeguridad || isSecurityUser) {
      console.log("Usuario de seguridad intentó eliminar - acción bloqueada")
      toast({
        variant: "destructive",
        title: "Sin permisos",
        description: "Los usuarios de seguridad no pueden eliminar pases",
      })
      return
    }
    
    // Verificar si el pase está autorizado
    if (pase.estado === 'AUTORIZADO') {
      toast({
        variant: "destructive",
        title: "No se puede eliminar",
        description: "No se pueden eliminar pases autorizados",
        action: <ToastAction altText="Cerrar">Cerrar</ToastAction>,
      });
      return;
    }
    
    try {
      await deletePase(pase.id);
      toast({
        variant: "default",
        title: "Pase eliminado",
        description: "El pase ha sido eliminado correctamente",
      });
      
      // Redirigir al dashboard después de eliminar - solo para usuarios autorizados, NO para seguridad
      if (user?.role === "autorizador" || user?.role === "admin") {
        setTimeout(() => {
          router.push("/autorizar/dashboard")
        }, 1500);
      }
    } catch (error) {
      console.error("Error al eliminar pase:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el pase. Intente nuevamente.",
      });
    }
  }

  // Modificamos la condición para que siempre sea true y no bloquee los botones
  const isFormComplete = true // Antes era: pase.firma && pase.sello

  return (
    <AuthRedirect allowedRoles={['autorizador', 'admin', 'seguridad']}>
      <NavigationGuard when={isEditing || activeSection !== null}>
        <div className="min-h-screen px-2 py-4">
          <AppHeader
            title="Autorización de Pase de Salida"
            description="Agregue firma y sello para autorizar este pase de salida."
            titleClassName="text-2xl font-bold text-white"
            descriptionClassName="text-white/90 mt-2"
            actions={
              <div className="flex gap-2">
                <BackButton
                  fallbackUrl={
                    user?.role === "admin"
                      ? "/admin"
                      : user?.role === "autorizador"
                        ? "/autorizar/dashboard"
                        : "/seguridad"
                  }
                  className=""
                />

                {canEdit && !isEditing && user?.role !== 'seguridad' && (
                  <Button
                    variant="outline"
                    className="bg-amber-500 text-white border-none hover:bg-amber-600 font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2"
                    onClick={() => setIsEditing(true)}
                  >
                    <EditIcon className="h-4 w-4" />
                    Editar Datos
                  </Button>
                )}

                <PdfExport 
                  contentRef={formRef} 
                  fileName={`pase-salida-${pase.folio}`} 
                  disabled={!isFormComplete}
                  className="bg-green-600 text-white border-none hover:bg-green-700 font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2" 
                  onStart={() => {
                    setIsExporting(true);
                    if (modifyContainerRef.current) modifyContainerRef.current.style.display = 'none';
                  }}
                  onFinish={() => {
                    setIsExporting(false);
                    if (modifyContainerRef.current) modifyContainerRef.current.style.display = '';
                  }}
                />
              </div>
            }
          />

          <Card className="shadow-xl bg-white rounded-xl overflow-hidden mx-auto w-full print:shadow-none print:rounded-lg print:border print:border-blue-300 print:overflow-hidden print:max-w-[800px] print:mx-auto print:my-4 print:bg-white">
            <div ref={formRef} className="font-sans print:w-full print:max-w-full print:m-0 print:p-0 print:text-xs print:leading-normal print:text-black print:break-inside-avoid print:box-border print:scale-100 print:origin-top-center print:bg-white">
              <CardHeader className="bg-gradient-to-r from-blue-800 to-blue-600 text-white p-6 flex flex-row items-center space-y-0 gap-4 print:bg-gradient-to-r print:from-blue-800 print:to-blue-600 print:text-white print:p-3 print:flex print:justify-between print:items-center print:border-0 print:m-0 print:min-h-[60px] print:w-full print:box-border print:rounded-none print:shadow-none">
                <div className="bg-white p-3 rounded-xl shadow-md transform transition-transform hover:scale-105 print:bg-white print:text-blue-900 print:p-2 print:font-bold print:text-sm print:border print:border-blue-300 print:rounded-md print:flex print:justify-center print:items-center print:min-w-[80px] print:shadow-none">
                  <h2 className="text-blue-800 font-bold text-lg text-center">PEPSICO</h2>
                </div>
                <div className="flex-1 text-center print:flex-1 print:text-center print:text-base print:font-bold print:uppercase print:tracking-wide print:mx-2">
                  <h1 className="text-2xl font-bold tracking-tight uppercase text-center print:text-xl print:font-extrabold print:tracking-wider">Pase de Salida Tráfico</h1>
                </div>
                <div className="text-right flex flex-col items-end gap-3 print:text-right text-center">
                  <Badge
                    variant={
                      pase.estado === "PENDIENTE"
                        ? "outline"
                        : pase.estado === "FIRMADO"
                          ? "default"
                          : pase.estado === "AUTORIZADO"
                            ? "default"
                            : "destructive"
                    }
                    className={
                      "text-sm font-medium px-4 py-1.5 rounded-full shadow-md print:px-3 print:py-1 print:text-[11px] print:font-bold print:border-0 print:rounded-md print:shadow-none print:uppercase print:tracking-wide " +
                      (pase.estado === "PENDIENTE" 
                        ? "bg-yellow-500 text-white border-none print:bg-yellow-500 print:text-white" 
                        : pase.estado === "FIRMADO" 
                          ? "bg-blue-500 text-white border-none print:bg-blue-500 print:text-white" 
                          : pase.estado === "RECHAZADO" 
                            ? "bg-red-500 text-white border-none print:bg-red-500 print:text-white" 
                            : "bg-green-500 text-white border-none print:bg-green-500 print:text-white")
                    }
                  >
                    {pase.estado === "PENDIENTE"
                      ? "Pendiente"
                      : pase.estado === "FIRMADO"
                        ? "Firmado"
                        : pase.estado === "AUTORIZADO"
                          ? "Autorizado"
                          : "Rechazado"}
                  </Badge>
                  <p className="text-sm font-medium bg-blue-900 text-white px-4 py-1.5 rounded-full shadow-md print:bg-blue-900 print:text-white print:px-3 print:py-1 print:text-[11px] print:font-bold print:border-0 print:rounded-md print:shadow-none print:mt-1 print:tracking-wider print:letter-spacing-1 text-center">FOLIO: {pase.folio}</p>
                </div>
              </CardHeader>

              <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-3 text-center border-b border-blue-200 shadow-sm print:bg-blue-100 print:text-center print:p-2 print:border-l-0 print:border-r-0 print:border-b print:border-blue-300 print:font-bold print:text-sm print:m-0 print:w-full print:box-border print:text-blue-800">
                <h3 className="font-semibold text-blue-800 tracking-wide">AZCAPOTZALCO</h3>
              </div>

              <CardContent className="p-6 print:border-0 print:bg-white print:p-3 print:w-full print:box-border print:m-0 print:max-w-full print:shadow-none print:text-black">
                {isEditing ? (
                  // Edit mode
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 print:grid print:grid-cols-2 print:gap-1.5 print:mb-1 print:pb-0.5 print:border-b print:border-black">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm print:flex print:items-center print:gap-1 print:p-0.5">
                        <Label htmlFor="razonSocial" className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide print:font-bold print:text-[10px] print:uppercase print:min-w-[100px] print:m-0">RAZÓN SOCIAL:</Label>
                        <Input
                          id="razonSocial"
                          name="razonSocial"
                          value={editFormData.razonSocial}
                          onChange={handleEditChange}
                          className="mt-1 bg-white border-gray-300 print:bg-white print:border print:border-black print:p-1 print:text-[10px] print:min-h-[18px] print:flex-1"
                        />
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm print:flex print:items-center print:gap-1 print:p-0.5">
                        <Label htmlFor="fecha" className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide print:font-bold print:text-[10px] print:uppercase print:min-w-[100px] print:m-0">FECHA:</Label>
                        <Input
                          id="fecha"
                          name="fecha"
                          type="date"
                          value={editFormData.fecha}
                          onChange={handleEditChange}
                          className="mt-1 bg-white border-gray-300 print:bg-white print:border print:border-black print:p-1 print:text-[10px] print:min-h-[18px] print:flex-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 print:grid print:grid-cols-3 print:gap-1 print:mb-1 print:pb-0.5 print:border-b print:border-black">
                      <div className="border p-4 rounded-md bg-gray-50 shadow-sm print:border print:border-black print:bg-white print:p-1">
                        <h3 className="font-bold text-center mb-4 text-gray-800 border-b pb-2 print:bg-gray-100 print:border print:border-black print:p-1 print:m-[-3px -3px 5px -3px] print:text-center print:font-bold print:text-[10px] print:uppercase">TRACTOR</h3>
                        <div className="grid grid-cols-2 gap-4 print:grid print:grid-cols-2 print:gap-0.5">
                          <div className="print:text-center">
                            <Label htmlFor="tractorEco" className="text-sm font-semibold mb-1 text-gray-600 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">ECO</Label>
                            <Input
                              id="tractorEco"
                              name="tractorEco"
                              value={editFormData.tractorEco}
                              onChange={handleEditChange}
                              className="mt-1 bg-white border-gray-300 print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] "
                            />
                          </div>
                          <div className="text-center">
                            <Label htmlFor="tractorPlaca" className="text-sm font-semibold mb-1 text-gray-600 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">PLACA</Label>
                            <Input
                              id="tractorPlaca"
                              name="tractorPlaca"
                              value={editFormData.tractorPlaca}
                              onChange={handleEditChange}
                              className="mt-1 bg-white border-gray-300 print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border p-4 rounded-md bg-gray-50 shadow-sm print:border print:border-black print:bg-white print:p-1">
                        <h3 className="font-bold text-center mb-4 text-gray-800 border-b pb-2 print:bg-gray-100 print:border print:border-black print:p-1 print:m-[-3px -3px 5px -3px] print:text-center print:font-bold print:text-[10px] print:uppercase">REMOLQUE 1</h3>
                        <div className="grid grid-cols-2 gap-4 print:grid print:grid-cols-2 print:gap-0.5">
                          <div className="print:text-center">
                            <Label htmlFor="remolque1Eco" className="text-sm font-semibold mb-1 text-gray-600 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">ECO</Label>
                            <Input
                              id="remolque1Eco"
                              name="remolque1Eco"
                              value={editFormData.remolque1Eco}
                              onChange={handleEditChange}
                              className="mt-1 bg-white border-gray-300 print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center"
                            />
                          </div>
                          <div className="print:text-center">
                            <Label htmlFor="remolque1Placa" className="text-sm font-semibold mb-1 text-gray-600 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">PLACA</Label>
                            <Input
                              id="remolque1Placa"
                              name="remolque1Placa"
                              value={editFormData.remolque1Placa}
                              onChange={handleEditChange}
                              className="mt-1 bg-white border-gray-300 print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border p-4 rounded-md bg-gray-50 shadow-sm print:border print:border-black print:bg-white print:p-1">
                        <h3 className="font-bold text-center mb-4 text-gray-800 border-b pb-2 print:bg-gray-100 print:border print:border-black print:p-1 print:m-[-3px -3px 5px -3px] print:text-center print:font-bold print:text-[10px] print:uppercase">REMOLQUE 2</h3>
                        <div className="grid grid-cols-2 gap-4 print:grid print:grid-cols-2 print:gap-0.5">
                          <div className="print:text-center">
                            <Label htmlFor="remolque2Eco" className="text-sm font-semibold mb-1 text-gray-600 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">ECO</Label>
                            <Input
                              id="remolque2Eco"
                              name="remolque2Eco"
                              value={editFormData.remolque2Eco}
                              onChange={handleEditChange}
                              className="mt-1 bg-white border-gray-300 print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center"
                            />
                          </div>
                          <div className="print:text-center">
                            <Label htmlFor="remolque2Placa" className="text-sm font-semibold mb-1 text-gray-600 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">PLACA</Label>
                            <Input
                              id="remolque2Placa"
                              name="remolque2Placa"
                              value={editFormData.remolque2Placa}
                              onChange={handleEditChange}
                              className="mt-1 bg-white border-gray-300 print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm print:border print:border-black print:p-1 print:shadow-none print:rounded-none print:bg-white">
                      <h3 className="font-bold mb-4 text-gray-800 border-b pb-2 uppercase tracking-wide print:bg-gray-100 print:border print:border-black print:p-1 print:m-[-3px -3px 5px -3px] print:text-center print:font-bold print:text-[10px] print:uppercase">OPERADOR:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid print:grid-cols-3 print:gap-0.5">
                        <div className="print:text-center">
                          <Label htmlFor="operadorNombre" className="text-sm font-semibold mb-1 text-gray-600 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">NOMBRE(S)</Label>
                          <Input
                            id="operadorNombre"
                            name="operadorNombre"
                            value={editFormData.operadorNombre}
                            onChange={handleEditChange}
                            className="mt-1 bg-white border-gray-300 print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center"
                          />
                        </div>
                        <div className="print:text-center">
                          <Label htmlFor="operadorApellidoPaterno" className="text-sm font-semibold mb-1 text-gray-600 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">APELLIDO PATERNO</Label>
                          <Input
                            id="operadorApellidoPaterno"
                            name="operadorApellidoPaterno"
                            value={editFormData.operadorApellidoPaterno}
                            onChange={handleEditChange}
                            className="mt-1 bg-white border-gray-300 print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center"
                          />
                        </div>
                        <div className="print:text-center">
                          <Label htmlFor="operadorApellidoMaterno" className="text-sm font-semibold mb-1 text-gray-600 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">APELLIDO MATERNO</Label>
                          <Input
                            id="operadorApellidoMaterno"
                            name="operadorApellidoMaterno"
                            value={editFormData.operadorApellidoMaterno}
                            onChange={handleEditChange}
                            className="mt-1 bg-white border-gray-300 print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 print:grid print:grid-cols-2 print:gap-0.5">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm print:border print:border-black print:p-1 print:shadow-none print:rounded-none print:bg-white">
                        <Label htmlFor="ecoDolly" className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">ECO DOLLY</Label>
                        <Input
                          id="ecoDolly"
                          name="ecoDolly"
                          value={editFormData.ecoDolly}
                          onChange={handleEditChange}
                          className="mt-1 bg-white border-gray-300 print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center"
                        />
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm print:border print:border-black print:p-1 print:shadow-none print:rounded-none print:bg-white">
                        <Label htmlFor="placasDolly" className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">PLACAS DOLLY</Label>
                        <Input
                          id="placasDolly"
                          name="placasDolly"
                          value={editFormData.placasDolly}
                          onChange={handleEditChange}
                          className="mt-1 bg-white border-gray-300 print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center"
                        />
                      </div>
                    </div>

                    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm print:border print:border-black print:p-1 print:shadow-none print:rounded-none print:bg-white">
                      <Label htmlFor="comentarios" className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">COMENTARIOS:</Label>
                      <Textarea
                        id="comentarios"
                        name="comentarios"
                        value={editFormData.comentarios || ''}
                        onChange={handleEditChange}
                        className="mt-1 bg-white border-gray-300 min-h-[60px] print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[32px]"
                        rows={2}
                      />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleSaveEdit}
                        className="bg-blue-700 hover:bg-blue-800 flex items-center gap-2"
                      >
                        <SaveIcon className="h-4 w-4" />
                        Guardar Cambios
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View mode ////////////
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 print:grid print:grid-cols-2 print:gap-0.5">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm print:border print:border-black print:p-1 print:shadow-none print:rounded-none print:bg-white">
                        <label className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">RAZÓN SOCIAL:</label>
                        <p className="text-base font-medium text-gray-800 value print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center">{pase.razonSocial}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm print:border print:border-black print:p-1 print:shadow-none print:rounded-none print:bg-white">
                        <label className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">FECHA:</label>
                        <p className="text-base font-medium text-gray-800 value print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center">{new Date(pase.fecha).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 print:grid print:grid-cols-3 print:gap-0.5">
                      <div className="border p-4 rounded-md bg-gray-50 shadow-sm print:border print:border-black print:p-1 print:shadow-none print:rounded-none print:bg-white">
                        <h3 className="font-bold text-center mb-4 text-gray-800 border-b pb-2 print:bg-gray-100 print:border print:border-black print:p-1 print:m-[-3px -3px 5px -3px] print:text-center print:font-bold print:text-[10px] print:uppercase">TRACTOR</h3>
                        <div className="grid grid-cols-2 gap-4 print:grid print:grid-cols-2 print:gap-0.5">
                          <div className="print:text-center">
                            <label className="text-sm font-semibold mb-1 text-gray-600 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">ECO</label>
                            <p className="text-base font-medium text-gray-800 value print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center">{pase.tractorEco}</p>
                          </div>
                          <div className="print:text-center">
                            <label className="text-sm font-semibold mb-1 text-gray-600 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">PLACA</label>
                            <p className="text-base font-medium text-gray-800 value print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center">{pase.tractorPlaca}</p>
                          </div>
                        </div>
                      </div>

                      <div className="border p-4 rounded-md bg-gray-50 shadow-sm print:border print:border-black print:p-1 print:shadow-none print:rounded-none print:bg-white">
                        <h3 className="font-bold text-center mb-4 text-gray-800 border-b pb-2 print:bg-gray-100 print:border print:border-black print:p-1 print:m-[-3px -3px 5px -3px] print:text-center print:font-bold print:text-[10px] print:uppercase">REMOLQUE 1</h3>
                        <div className="grid grid-cols-2 gap-4 print:grid print:grid-cols-2 print:gap-0.5">
                          <div className="print:text-center">
                            <label className="text-sm font-semibold mb-1 text-gray-600 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">ECO</label>
                            <p className="text-base font-medium text-gray-800 value print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center">{pase.remolque1Eco || "-"}</p>
                          </div>
                          <div className="print:text-center">
                            <label className="text-sm font-semibold mb-1 text-gray-600 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">PLACA</label>
                            <p className="text-base font-medium text-gray-800 value print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center">{pase.remolque1Placa || "-"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="border p-4 rounded-md bg-gray-50 shadow-sm print:border print:border-black print:p-1 print:shadow-none print:rounded-none print:bg-white">
                        <h3 className="font-bold text-center mb-4 text-gray-800 border-b pb-2 print:bg-gray-100 print:border print:border-black print:p-1 print:m-[-3px -3px 5px -3px] print:text-center print:font-bold print:text-[10px] print:uppercase">REMOLQUE 2</h3>
                        <div className="grid grid-cols-2 gap-4 print:grid print:grid-cols-2 print:gap-0.5">
                          <div className="print:text-center">
                            <label className="text-sm font-semibold mb-1 text-gray-600 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">ECO</label>
                            <p className="text-base font-medium text-gray-800 value print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center">{pase.remolque2Eco || "-"}</p>
                          </div>
                          <div className="print:text-center">
                            <label className="text-sm font-semibold mb-1 text-gray-600 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">PLACA</label>
                            <p className="text-base font-medium text-gray-800 value print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center">{pase.remolque2Placa || "-"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm print:border print:border-black print:p-1 print:shadow-none print:rounded-none print:bg-white">
                      <h3 className="font-bold mb-4 text-gray-800 border-b pb-2 uppercase tracking-wide print:bg-gray-100 print:border print:border-black print:p-1 print:m-[-3px -3px 5px -3px] print:text-center print:font-bold print:text-[10px] print:uppercase">OPERADOR:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid print:grid-cols-3 print:gap-0.5">
                        <div className="print:text-center">
                          <label className="text-sm font-semibold mb-1 text-gray-600 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">NOMBRE(S)</label>
                          <p className="text-base font-medium text-gray-800 value print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center">{pase.operadorNombre}</p>
                        </div>
                        <div className="print:text-center">
                          <label className="text-sm font-semibold mb-1 text-gray-600 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">APELLIDO PATERNO</label>
                          <p className="text-base font-medium text-gray-800 value print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center">{pase.operadorApellidoPaterno}</p>
                        </div>
                        <div className="print:text-center">
                          <label className="text-sm font-semibold mb-1 text-gray-600 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">APELLIDO MATERNO</label>
                          <p className="text-base font-medium text-gray-800 value print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center">{pase.operadorApellidoMaterno || "-"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 print:grid print:grid-cols-2 print:gap-0.5">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm print:border print:border-black print:p-1 print:shadow-none print:rounded-none print:bg-white">
                        <label className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">ECO DOLLY</label>
                        <p className="text-base font-medium text-gray-800 value print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center">{pase.ecoDolly || "-"}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm print:border print:border-black print:p-1 print:shadow-none print:rounded-none print:bg-white">
                        <label className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">PLACAS DOLLY</label>
                        <p className="text-base font-medium text-gray-800 value print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center">{pase.placasDolly || "-"}</p>
                      </div>
                    </div>

                    <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm print:border print:border-black print:p-1 print:shadow-none print:rounded-none print:bg-white">
                      <label className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide print:block print:font-bold print:text-[9px] print:uppercase print:mb-0.5">COMENTARIOS:</label>
                      <p className="text-base font-medium text-gray-800 value print:bg-white print:border print:border-black print:p-1 print:text-[9px] print:min-h-[16px] print:text-center">{pase.comentarios || "-"}</p>
                    </div>

                    <div className="print:mt-1 pt-1 print:border-t print:border-blue-300">
                      <div className="text-center p-4 rounded-lg border-2 print:border-blue-400 print:bg-blue-50 mb-5 mx-auto max-w-[100%] print:shadow-md">
                        <p className="font-bold text-lg text-blue-800 tracking-wide">AUTORIZA FACILITADOR DE TRANSPORTE</p>
                        <p className="text-sm mt-2 text-blue-700 font-medium">FIRMA Y SELLO</p>
                        {isSeguridad && (
                          <p className="text-xs mt-3 p-3 font-medium mt-3 mx-auto max-w-[90%] text-center text-sm">
                            Modo de solo lectura - No se permiten modificaciones
                          </p>
                        )}
                      </div>

                      <div className="mt-2 mb-2 ">
                        <div className="text-center mb-4 print:bg-blue-50 border-2 print:border-blue-400 rounded-lg py-3 px-5 mx-auto max-w-[100%] print:shadow-md">
                          <h3 className="print:text-lg print:font-semibold print:text-blue-800 print:tracking-wide">Autorización Digital</h3>
                          <p className="print:text-sm print:mt-2 print:text-blue-700 print:font-medium">Firma y sello del autorizante</p>
                        </div>
                        
                        {activeSection === "firma" && canAuthorize && !isSeguridad ? (
                          <div className="border border-gray-200 bg-white p-8 rounded-lg shadow-sm">
                            <div className="space-y-6">
                              <div className="text-center">
                                <h4 className="font-medium text-gray-700">Paso 1 de 2: Firma Digital</h4>
                                <p className="text-sm text-gray-500 mt-1">Dibuje su firma en el área de abajo</p>
                              </div>
                              <div className="border rounded-lg p-4 bg-white">
                                <SignaturePad onSave={handleSignatureSave} />
                              </div>
                              <div className="flex justify-end pt-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setActiveSection(null);
                                    setSignatureData(null);
                                  }}
                                  className="text-gray-700 border-gray-300 hover:bg-gray-50"
                                >
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : activeSection === "sello" && canAuthorize && !isSeguridad ? (
                          <div className="border border-gray-200 bg-white p-6 rounded-lg shadow-sm">
                            <div className="space-y-6">
                              <div className="text-center">
                                <h4 className="font-medium text-gray-700">Paso 2 de 2: Sello Digital</h4>
                                <p className="text-sm text-gray-500 mt-1">Suba una imagen de su sello o cree uno personalizado</p>
                              </div>
                              <div className="border rounded-lg p-4 bg-white">
                                <SealUpload onSave={handleSealSave} />
                              </div>
                              <div className="flex justify-between pt-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => { setIsModifying(true); setActiveSection("firma"); }}
                                  className="border-gray-300 hover:bg-gray-50"
                                >
                                  Atrás
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setActiveSection(null);
                                    setSignatureData(null);
                                    setSealData(null);
                                  }}
                                  className="text-gray-700 border-gray-300 hover:bg-gray-50"
                                >
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : pase.firma && pase.sello ? (
                          <div>
                            {/* Vista normal (pantalla) - Alineada de izquierda a derecha */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
                              {/* Firma */}
                              <div className="border border-gray-200 bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <PenIcon className="h-5 w-5 text-blue-600" /> Firma Digital
                                  </h3>
                                </div>
                                <div className="border border-gray-200 bg-white p-3 rounded-lg flex justify-center items-center h-32">
                                  <img 
                                    src={pase.firma} 
                                    alt="Firma digital" 
                                    className="max-h-full max-w-full object-contain" 
                                  />
                                </div>
                                <div className="mt-2 border-t border-gray-200 pt-2">
                                  <p className="text-xs text-gray-600 text-center">FIRMA DEL AUTORIZANTE</p>
                                </div>
                              </div>
                              
                              {/* Sello */}
                              <div className="border border-gray-200 bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <StampIcon className="h-5 w-5 text-blue-600" /> Sello Digital
                                  </h3>
                                </div>
                                <div className="border border-gray-200 bg-white p-3 rounded-lg flex justify-center items-center h-32">
                                  <img 
                                    src={pase.sello} 
                                    alt="Sello digital" 
                                    className="max-h-full max-w-full object-contain" 
                                  />
                                </div>
                                <div className="mt-2 border-t border-gray-200 pt-2">
                                  <p className="text-xs text-gray-600 text-center">SELLO DEL AUTORIZANTE</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Vista PDF (lado a lado) */}
                            <div className="hidden print:grid print:grid-cols-2 print:gap-6 print:mt-5 print:w-full print:mx-auto print:mb-4 print:font-sans print:text-sm">
                              <div className="print:border-2 print:border-[#004B93] print:rounded-lg print:p-3 print:flex print:flex-col print:items-center print:bg-[#F0F8FF] print:shadow-md">
                                <h3 className="print:text-center print:text-base print:font-bold print:mb-3 print:w-full print:text-[#004B93] print:border-b print:border-[#60A5FA] print:pb-1">FIRMA DIGITAL</h3>
                                <div className="print:flex print:justify-center print:items-center print:h-36 print:w-full print:bg-white print:p-3 print:rounded-md print:border-2 print:border-blue-300">
                                  <img 
                                    src={pase.firma} 
                                    alt="Firma digital" 
                                    className="print:max-h-full print:max-w-full print:object-contain print:mx-auto"
                                  />
                                </div>
                                <div className="print:mt-3 print:border-t print:border-blue-300 print:pt-2 print:w-full">
                                  <p className="print:text-center print:text-xs print:font-bold print:text-[#004B93]">FIRMA DEL AUTORIZANTE</p>
                                </div>
                              </div>
                              
                              <div className="print:border-2 print:border-[#E2001A] print:rounded-lg print:p-3 print:flex print:flex-col print:items-center print:bg-[#FFF5F5] print:shadow-md">
                                <h3 className="print:text-center print:text-base print:font-bold print:mb-3 print:w-full print:text-[#E2001A] print:border-b print:border-[#FCA5A5] print:pb-1">SELLO DIGITAL</h3>
                                <div className="print:flex print:justify-center print:items-center print:h-36 print:w-full print:bg-white print:p-3 print:rounded-md print:border-2 print:border-blue-300">
                                  <img 
                                    src={pase.sello} 
                                    alt="Sello digital" 
                                    className="print:max-h-full print:max-w-full print:object-contain print:mx-auto"
                                  />
                                </div>
                                <div className="print:mt-3 print:border-t print:border-blue-300 print:pt-2 print:w-full">
                                  <p className="print:text-center print:text-xs print:font-bold print:text-[#E2001A]">SELLO DEL AUTORIZANTE</p>
                                </div>
                              </div>
                            </div>
                            
                            {!isSeguridad && !isExporting && (
                              <div id="modify-button-container" ref={modifyContainerRef} className="flex justify-center pt-2 print:hidden hide-in-pdf" data-pdf-hide="true">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setIsModifying(true);
                                    setActiveSection("firma");
                                    setSignatureData(null);
                                    setSealData(null);
                                  }}
                                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                  <EditIcon className="h-4 w-4 mr-2" />
                                  <span data-pdf-hide="true">Modificar Firma y Sello</span>
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : canAuthorize && !isSeguridad ? (
                          <div className="border border-gray-200 bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex flex-col items-center space-y-4 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                              <div className="flex items-center gap-3">
                                <PenIcon className="h-8 w-8 text-blue-500" />
                                <StampIcon className="h-8 w-8 text-red-500" />
                              </div>
                              <p className="text-center text-gray-600">
                                Para firmar y sellar el documento, haga clic en el botón de abajo.
                              </p>
                              <Button
                                type="button"
                                onClick={() => setActiveSection("firma")}
                                className="bg-blue-700 hover:bg-blue-800 text-white print:hidden hide-in-pdf"
                                disabled={isSeguridad}
                              >
                                <PenIcon className="h-4 w-4 mr-2" />
                                Agregar Firma y Sello
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="border border-gray-200 bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex justify-center p-4 text-gray-500 italic">
                              <p>Pendiente de firma y sello</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="print:text-center mt-6 print:mb-5 print:font-bold print:w-full print:border-4 print:border-red-600 print:bg-red-100 print:p-4 print:rounded-lg print:mx-auto print:max-w-[95%] print:shadow-md">
                        <p className="text-center print:uppercase text-red-800 font-bold tracking-wider text-base">ESTE PASE NO ES VÁLIDO SI NO CONTIENE FIRMA Y SELLO DEL AUTORIZANTE</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </div>

            {canAuthorize && (pase.estado === "PENDIENTE" || pase.estado === "FIRMADO") && !isEditing && !isSeguridad && (
              <CardFooter className="bg-gray-50 border-t p-4 flex justify-between gap-3">
                <Button
                  onClick={handleDelete}
                  className="bg-red-700 hover:bg-red-800 text-white font-medium py-2 px-6 rounded-md shadow-md flex items-center gap-2 transition-colors duration-200"
                >
                  <TrashIcon className="h-5 w-5" />
                  Eliminar Pase
                </Button>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleAutorizar(false)}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md shadow-md flex items-center gap-2 transition-colors duration-200"
                  >
                    <XCircleIcon className="h-5 w-5" />
                    Rechazar Pase
                  </Button>
                  <Button
                    onClick={() => handleAutorizar(true)}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md shadow-md flex items-center gap-2 transition-colors duration-200"
                  >
                    <CheckIcon className="h-5 w-5" />
                    Aprobar Pase
                  </Button>
                </div>
              </CardFooter>
            )}
          </Card>
        </div>
      </NavigationGuard>
    </AuthRedirect>
  )
}

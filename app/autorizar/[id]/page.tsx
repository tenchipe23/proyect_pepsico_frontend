// This is a Client Component
"use client"

import React, { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { usePase } from "@/context/pase-context"
import SignaturePad from "@/components/signature-pad"
import SealUpload from "@/components/seal-upload"
import PdfExport from "@/components/pdf-export"
import { PenIcon, StampIcon, CheckIcon, EditIcon, SaveIcon, AlertCircleIcon, XCircleIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
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
  const { getPaseById, updatePase, signPase } = usePase()
  const { toast } = useToast()
  const formRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>
  const [activeSection, setActiveSection] = useState<"firma" | "sello" | null>(null)
  const [signatureData, setSignatureData] = useState<string | null>(null)
  const [sealData, setSealData] = useState<string | null>(null)
  const [pase, setPase] = useState<ReturnType<typeof getPaseById>>(undefined)
  const [isEditing, setIsEditing] = useState(false)
  const [editFormData, setEditFormData] = useState<Partial<any>>({})
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const router = useRouter()

  // Load user data and pase data
  useEffect(() => {
    try {
      console.log("Cargando datos en la página de detalle, ID:", id)

      // Get user data
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const userData = JSON.parse(storedUser)
          console.log("Usuario cargado:", userData.name, userData.role)
          setUser(userData)
        } else {
          console.log("No se encontró usuario en localStorage")
        }
      }

      // Check if we're on the dashboard route
      if (id === "dashboard") {
        console.log("Detectada ruta de dashboard como ID de pase, redirigiendo...")
        // Redirect to the correct dashboard route
        window.location.href = "/autorizar/dashboard"
        return
      }

      // Load pass data
      const paseData = getPaseById(id)
      if (!paseData) {
        console.log("Pase no encontrado")
        setLoadError(`No se encontró el pase con ID: ${id}`)
        setIsLoading(false)
        return
      }

      console.log("Datos del pase cargados:", paseData.folio)
      setPase(paseData)

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
      setLoadError("Error al cargar los datos. Por favor, intente nuevamente.")
      setIsLoading(false)
    }
  }, [id, getPaseById])

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
          <Button
            variant="outline"
            onClick={() => {
              if (user?.role === "admin") {
                window.location.href = "/admin"
              } else if (user?.role === "autorizador") {
                window.location.href = "/autorizar/dashboard"
              } else {
                window.location.href = "/seguridad"
              }
            }}
            className="mt-4"
          >
            Volver al panel
          </Button>
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
  // Check if the user has permissions to edit
  const canEdit = user?.role === "admin" || user?.role === "autorizador"

  const handleSignatureSave = (signature: string) => {
    // Check if pass is in PENDING state before allowing signature
    if (pase.estado !== 'PENDIENTE') {
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

  const handleSealSave = async (seal: string) => {
    // Check if pass is in PENDING state before allowing seal
    if (pase.estado !== 'PENDIENTE') {
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
      
      const signatureDataToSave = {
        signature: signatureData,
        seal: seal
      };
      
      // Call the signPass API endpoint and wait for it to complete
      await signPase(pase.id!, signatureDataToSave);
      
      // Update local state after successful API call
      setPase(prev => ({
        ...prev!,
        estado: 'FIRMADO',
        firma: signatureData,
        sello: seal,
        fechaFirma: new Date().toISOString()
      }));
      
      // Reset signature and seal data
      setSignatureData(null);
      setSealData(null);
      setActiveSection(null);

      toast({
        variant: "default",
        title: "Firma y sello guardados",
        description: "El sello ha sido guardado correctamente",
      })
    } catch (error) {
      console.error("Error al guardar sello:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar el sello. Intente nuevamente.",
      })
    }
  }

  const handleAutorizar = (approve: boolean) => {
    if (!pase.firma || !pase.sello) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debe agregar firma y sello para autorizar el pase",
      })
      return
    }

    try {
      updatePase(pase.id!, {
        estado: approve ? "FIRMADO" : "RECHAZADO",
        fechaFirma: new Date().toISOString(),
      })

      setPase({
        ...pase,
        estado: approve ? "FIRMADO" : "RECHAZADO", // Usa mayúsculas
        fechaFirma: new Date().toISOString(),
      })

      toast({
        variant: "default", // Cambia "success" por "default"
        title: approve ? "Pase autorizado" : "Pase rechazado",
        description: approve
          ? "El pase ha sido firmado y sellado correctamente"
          : "El pase ha sido rechazado correctamente",
      })

      // Redirect to dashboard after authorizing
      setTimeout(() => {
        if (user?.role === "autorizador" || user?.role === "admin") {
          router.push("/autorizar/dashboard")
        }
      }, 1500)
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
      setPase(prev => ({
        ...prev!,
        ...formattedData,
        fecha: formattedData.fecha // Ensure fecha is always a string
      }));
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
    if (user?.role === "admin") {
      router.push("/admin")
    } else if (user?.role === "autorizador") {
      router.push("/autorizar/dashboard")
    } else {
      router.push("/seguridad")
    }
  }

  const isFormComplete = pase.firma && pase.sello

  return (
    <AuthRedirect allowedRoles={['AUTORIZADOR', 'ADMIN']}>
      <NavigationGuard when={isEditing || activeSection !== null}>
        <div className="min-h-screen bg-gray-50">
          <AppHeader
            title="Autorización de Pase de Salida"
            description="Agregue firma y sello para autorizar este pase de salida."
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
                />

                {canEdit && !isEditing && (
                  <Button
                    variant="outline"
                    className="bg-white/10 text-white hover:bg-white/20 flex items-center gap-2"
                    onClick={() => setIsEditing(true)}
                  >
                    <EditIcon className="h-4 w-4" />
                    Editar Datos
                  </Button>
                )}

                <PdfExport contentRef={formRef} fileName={`pase-salida-${pase.folio}`} disabled={!isFormComplete} />
              </div>
            }
          />

          <Card className="shadow-xl">
            <div ref={formRef}>
              <CardHeader className="bg-gray-900 text-white p-4 flex flex-row items-center space-y-0 gap-4">
                <div className="bg-white p-2 rounded">
                  <h2 className="text-gray-900 font-bold">PEPSICO</h2>
                </div>
                <div className="flex-1 text-center">
                  <h1 className="text-xl font-bold">PASE DE SALIDA TRAFICO</h1>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
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
                      pase.estado === "PENDIENTE"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                        : pase.estado === "FIRMADO"
                          ? "bg-blue-600"
                          : pase.estado === "RECHAZADO"
                            ? "bg-red-600"
                            : ""
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
                  <p className="text-sm">FOLIO: {pase.folio}</p>
                </div>
              </CardHeader>

              <div className="bg-gray-100 p-2 text-center border-b">
                <h3 className="font-medium">AZCAPOTZALCO</h3>
              </div>

              <CardContent className="p-6">
                {isEditing ? (
                  // Edit mode
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <Label htmlFor="razonSocial">RAZÓN SOCIAL:</Label>
                        <Input
                          id="razonSocial"
                          name="razonSocial"
                          value={editFormData.razonSocial}
                          onChange={handleEditChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fecha">FECHA:</Label>
                        <Input
                          id="fecha"
                          name="fecha"
                          type="date"
                          value={editFormData.fecha}
                          onChange={handleEditChange}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="border p-4 rounded-md">
                        <h3 className="font-bold text-center mb-4">TRACTOR</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="tractorEco">ECO</Label>
                            <Input
                              id="tractorEco"
                              name="tractorEco"
                              value={editFormData.tractorEco}
                              onChange={handleEditChange}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="tractorPlaca">PLACA</Label>
                            <Input
                              id="tractorPlaca"
                              name="tractorPlaca"
                              value={editFormData.tractorPlaca}
                              onChange={handleEditChange}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border p-4 rounded-md">
                        <h3 className="font-bold text-center mb-4">REMOLQUE 1</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="remolque1Eco">ECO</Label>
                            <Input
                              id="remolque1Eco"
                              name="remolque1Eco"
                              value={editFormData.remolque1Eco}
                              onChange={handleEditChange}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="remolque1Placa">PLACA</Label>
                            <Input
                              id="remolque1Placa"
                              name="remolque1Placa"
                              value={editFormData.remolque1Placa}
                              onChange={handleEditChange}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border p-4 rounded-md">
                        <h3 className="font-bold text-center mb-4">REMOLQUE 2</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="remolque2Eco">ECO</Label>
                            <Input
                              id="remolque2Eco"
                              name="remolque2Eco"
                              value={editFormData.remolque2Eco}
                              onChange={handleEditChange}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="remolque2Placa">PLACA</Label>
                            <Input
                              id="remolque2Placa"
                              name="remolque2Placa"
                              value={editFormData.remolque2Placa}
                              onChange={handleEditChange}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-bold mb-2">OPERADOR:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="operadorNombre">NOMBRE(S)</Label>
                          <Input
                            id="operadorNombre"
                            name="operadorNombre"
                            value={editFormData.operadorNombre}
                            onChange={handleEditChange}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="operadorApellidoPaterno">APELLIDO PATERNO</Label>
                          <Input
                            id="operadorApellidoPaterno"
                            name="operadorApellidoPaterno"
                            value={editFormData.operadorApellidoPaterno}
                            onChange={handleEditChange}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="operadorApellidoMaterno">APELLIDO MATERNO</Label>
                          <Input
                            id="operadorApellidoMaterno"
                            name="operadorApellidoMaterno"
                            value={editFormData.operadorApellidoMaterno}
                            onChange={handleEditChange}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <Label htmlFor="ecoDolly">ECO DOLLY</Label>
                        <Input
                          id="ecoDolly"
                          name="ecoDolly"
                          value={editFormData.ecoDolly}
                          onChange={handleEditChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="placasDolly">PLACAS DOLLY</Label>
                        <Input
                          id="placasDolly"
                          name="placasDolly"
                          value={editFormData.placasDolly}
                          onChange={handleEditChange}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <Label htmlFor="comentarios">COMENTARIOS:</Label>
                      <Textarea
                        id="comentarios"
                        name="comentarios"
                        value={editFormData.comentarios || ''}
                        onChange={handleEditChange}
                        className="mt-1"
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
                  // View mode
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="text-sm font-medium mb-1">RAZÓN SOCIAL:</p>
                        <p className="p-2 border rounded-md bg-gray-50">{pase.razonSocial}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">FECHA:</p>
                        <p className="p-2 border rounded-md bg-gray-50">{new Date(pase.fecha).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="border p-4 rounded-md">
                        <h3 className="font-bold text-center mb-4">TRACTOR</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium mb-1">ECO</p>
                            <p className="p-2 border rounded-md bg-gray-50">{pase.tractorEco}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">PLACA</p>
                            <p className="p-2 border rounded-md bg-gray-50">{pase.tractorPlaca}</p>
                          </div>
                        </div>
                      </div>

                      <div className="border p-4 rounded-md">
                        <h3 className="font-bold text-center mb-4">REMOLQUE 1</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium mb-1">ECO</p>
                            <p className="p-2 border rounded-md bg-gray-50">{pase.remolque1Eco || "-"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">PLACA</p>
                            <p className="p-2 border rounded-md bg-gray-50">{pase.remolque1Placa || "-"}</p>
                          </div>
                        </div>
                      </div>

                      <div className="border p-4 rounded-md">
                        <h3 className="font-bold text-center mb-4">REMOLQUE 2</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium mb-1">ECO</p>
                            <p className="p-2 border rounded-md bg-gray-50">{pase.remolque2Eco || "-"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-1">PLACA</p>
                            <p className="p-2 border rounded-md bg-gray-50">{pase.remolque2Placa || "-"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-bold mb-2">OPERADOR:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-1">NOMBRE(S)</p>
                          <p className="p-2 border rounded-md bg-gray-50">{pase.operadorNombre}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">APELLIDO PATERNO</p>
                          <p className="p-2 border rounded-md bg-gray-50">{pase.operadorApellidoPaterno}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">APELLIDO MATERNO</p>
                          <p className="p-2 border rounded-md bg-gray-50">{pase.operadorApellidoMaterno || "-"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <p className="text-sm font-medium mb-1">ECO DOLLY</p>
                        <p className="p-2 border rounded-md bg-gray-50">{pase.ecoDolly || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">PLACAS DOLLY</p>
                        <p className="p-2 border rounded-md bg-gray-50">{pase.placasDolly || "-"}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm font-medium mb-1">COMENTARIOS:</p>
                      <p className="p-2 border rounded-md bg-gray-50 min-h-[60px]">{pase.comentarios || "-"}</p>
                    </div>

                    <div className="border-t pt-6 mt-6">
                      <div className="text-center mb-4">
                        <p className="font-bold">AUTORIZA FACILITADOR DE TRANSPORTE</p>
                        <p className="text-sm mt-2">FIRMA Y SELLO</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        {/* Signature Section */}
                        <div className="border p-4 rounded-md">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold flex items-center gap-2">
                              <PenIcon className="h-4 w-4" /> Firma y Sello Digital
                            </h3>
                            {(pase.firma || pase.sello) && activeSection === null && canAuthorize && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setActiveSection("firma");
                                  setSignatureData(null);
                                  setSealData(null);
                                }}
                              >
                                {pase.firma && pase.sello ? 'Cambiar' : 'Agregar'}
                              </Button>
                            )}
                          </div>

                          {activeSection === "firma" && canAuthorize ? (
                            <div className="space-y-4">
                              <div className="text-center font-medium">Paso 1 de 2: Firma Digital</div>
                              <SignaturePad onSave={handleSignatureSave} />
                              <div className="flex justify-end">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setActiveSection(null);
                                    setSignatureData(null);
                                  }}
                                >
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          ) : activeSection === "sello" && canAuthorize ? (
                            <div className="space-y-4">
                              <div className="text-center font-medium">Paso 2 de 2: Sello Digital</div>
                              <SignaturePad onSave={handleSealSave} />
                              <div className="flex justify-between">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setActiveSection("firma")}
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
                                >
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          ) : pase.firma && pase.sello ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-500 mb-1">Firma Digital</p>
                                  <div className="border bg-white p-2 flex justify-center">
                                    <img src={pase.firma} alt="Firma digital" className="max-h-24" />
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500 mb-1">Sello Digital</p>
                                  <div className="border bg-white p-2 flex justify-center">
                                    <img src={pase.sello} alt="Sello digital" className="max-h-24" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : canAuthorize ? (
                            <div className="flex flex-col items-center space-y-4 p-4">
                              <p className="text-center text-gray-600">
                                Para firmar y sellar el documento, haga clic en el botón de abajo.
                              </p>
                              <Button
                                type="button"
                                onClick={() => setActiveSection("firma")}
                                className="bg-blue-700 hover:bg-blue-800"
                              >
                                Agregar Firma y Sello
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-center p-4 text-gray-500 italic">
                              <p>Pendiente de firma y sello</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-center text-sm text-gray-600 mt-6">
                        <p>ESTE PASE NO ES VÁLIDO SI NO CONTIENE FIRMA Y SELLO DEL AUTORIZANTE</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </div>

            {canAuthorize && pase.estado === "PENDIENTE" && !isEditing && (
              <CardFooter className="bg-gray-50 border-t p-4 flex justify-end gap-2">
                <Button
                  onClick={() => handleAutorizar(false)}
                  disabled={!isFormComplete}
                  className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                >
                  <XCircleIcon className="h-4 w-4" />
                  Rechazar Pase
                </Button>
                <Button
                  onClick={() => handleAutorizar(true)}
                  disabled={!isFormComplete}
                  className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  <CheckIcon className="h-4 w-4" />
                  Aprobar Pase
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </NavigationGuard>
    </AuthRedirect>
  )
}

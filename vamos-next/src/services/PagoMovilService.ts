/**
 * PagoMovilService.ts
 * Servicio agnóstico y Plug & Play para integración con agregadores de pago móvil (Venezuela).
 * Inyecta automáticamente el NEXT_PUBLIC_VAMOS_PAYMENT_PROJECT_ID en las peticiones.
 */

interface PagoMovilParams {
  bancoOrigen: string;
  telefono: string;
  cedula: string;
  monto: number;
  referencia: string;
}

interface PagoMovilResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  detail?: string;
  error?: string;
}

class PagoMovilService {
  private static projectId = process.env.NEXT_PUBLIC_VAMOS_PAYMENT_PROJECT_ID;

  /**
   * Procesa un pago móvil validando primero las credenciales del proyecto.
   */
  static async procesarPago(params: PagoMovilParams): Promise<PagoMovilResponse> {
    console.log("[PagoMovilService] Iniciando validación...");

    // Validación de seguridad crítica
    if (!this.projectId || this.projectId.trim() === "") {
      const errorMsg = "Error Crítico: ID de Proyecto de Pagos (NEXT_PUBLIC_VAMOS_PAYMENT_PROJECT_ID) no encontrado en variables de entorno.";
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      console.log(`[PagoMovilService] Procesando pago para Proyecto ID: ${this.projectId}`);
      
      const response = await this.mockApiCall(params);

      return {
        success: true,
        transactionId: response.id,
        message: "Pago procesado exitosamente.",
        detail: response.detail
      };

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      console.error("[PagoMovilService] Error en la transacción:", message);
      return {
        success: false,
        message: "Lo sentimos, no pudimos procesar tu pago móvil en este momento.",
        error: message
      };
    }
  }

  /**
   * Simulación de respuesta de API externa
   */
  private static async mockApiCall(params: PagoMovilParams) {
    return new Promise<{ id: string, detail: string }>((resolve) => {
      setTimeout(() => {
        // Simulación de éxito
        resolve({
          id: `REF-${Math.floor(Math.random() * 1000000)}`,
          detail: `Pago de ${params.monto} BS aceptado.`
        });
      }, 1500);
    });
  }
}

export default PagoMovilService;

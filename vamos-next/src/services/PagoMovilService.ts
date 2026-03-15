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

class PagoMovilService {
  private static projectId = process.env.NEXT_PUBLIC_VAMOS_PAYMENT_PROJECT_ID;

  /**
   * Procesa un pago móvil validando primero las credenciales del proyecto.
   */
  static async procesarPago(params: PagoMovilParams) {
    console.log("[PagoMovilService] Iniciando validación...");

    // Validación de seguridad crítica
    if (!this.projectId || this.projectId.trim() === "") {
      const errorMsg = "Error Crítico: ID de Proyecto de Pagos (NEXT_PUBLIC_VAMOS_PAYMENT_PROJECT_ID) no encontrado en variables de entorno.";
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      console.log(`[PagoMovilService] Procesando pago para Proyecto ID: ${this.projectId}`);
      
      // Simulación de llamada al agregador (ej. Ekiipago)
      // En una implementación real, aquí se usaría fetch() con el ID en los headers
      const response = await this.mockApiCall(params);

      return {
        success: true,
        transactionId: response.id,
        message: "Pago procesado exitosamente.",
        detail: response.detail
      };

    } catch (error: any) {
      console.error("[PagoMovilService] Error en la transacción:", error.message);
      return {
        success: false,
        message: "Lo sentimos, no pudimos procesar tu pago móvil en este momento.",
        error: error.message
      };
    }
  }

  /**
   * Simulación de respuesta de API externa
   */
  private static async mockApiCall(params: PagoMovilParams) {
    return new Promise<{ id: string, detail: string }>((resolve, reject) => {
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

import { z } from 'zod';

export const contactFormSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50, 'El nombre no puede exceder 50 caracteres'),
  telefono: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos').max(15, 'El teléfono no puede exceder 15 dígitos'),
  email: z.string().email('Ingresa un email válido'),
  mensaje: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres').max(500, 'El mensaje no puede exceder 500 caracteres')
});

export const orderSchema = z.object({
  cliente_nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50, 'El nombre no puede exceder 50 caracteres'),
  cliente_email: z.string().email('Ingresa un email válido'),
  cliente_telefono: z.string().min(8, 'El teléfono debe tener al menos 8 dígitos').max(15, 'El teléfono no puede exceder 15 dígitos').optional(),
  items: z.array(z.object({
    producto_id: z.number().positive(),
    cantidad: z.number().positive(),
    precio_unitario: z.number().positive()
  })).min(1, 'Debe haber al menos un producto en el pedido')
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type OrderData = z.infer<typeof orderSchema>;
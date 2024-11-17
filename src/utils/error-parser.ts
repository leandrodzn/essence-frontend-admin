import type { ErrorObject, ValidationArgs } from '@vuelidate/core'

interface ExtendedValidationArgs extends ValidationArgs {
  min?: number
  max?: number
}

const errorTraductions: Record<string, string> = {
  required: '{{campo}} es requerido',
  minLength: '{{campo}} debe tener al menos {{min}} caracteres',
  maxLength: '{{campo}} no debe tener más de {{max}} caracteres',
  minValue: '{{campo}} debe ser mayor o igual a {{min}}',
  maxValue: '{{campo}} debe ser menor o igual a {{max}}',
  url: '{{campo}} debe ser una URL válida',
  numeric: '{{campo}} debe ser un número',
  decimal: '{{campo}} debe ser un número decimal',
  requiredUnless: '{{campo}} es requerido',
  email: '{{campo}} debe ser un correo electrónico válido'
}

const arrayErrorTraductions: Record<string, string> = {
  required: '{{campo}} es requerido',
  minLength: '{{campo}} debe tener al menos {{min}} elementos',
  maxLength: '{{campo}} no debe tener más de {{max}} elementos',
  requiredUnless: '{{campo}} es requerido'
}

const errorParser = (
  errors: ErrorObject[],
  field: string,
  fieldType?: 'array' | 'string' | 'number'
) => {
  return errors
    .map((error) => {
      const params = error.$params as ExtendedValidationArgs
      const template =
        fieldType === 'array'
          ? arrayErrorTraductions[error.$validator]
          : errorTraductions[error.$validator]

      if (template) {
        return template
          .replace('{{campo}}', field)
          .replace('{{min}}', params?.min?.toString() || '')
          .replace('{{max}}', params?.max?.toString() || '')
      }

      return error.$message
    })
    .join(', ')
}

export default errorParser

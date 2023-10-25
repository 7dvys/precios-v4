// Contabilium
export const errorCodes = {
    missingCbCredentialsBoth:'missingCbCredentialsBoth',
    missingCbCredentialsMain:'missingCbCredentialsMain',
    missingCbCredentialsSecondary:'missingCbCredentialsSecondary',
    duplicatedCbCredentials:'duplicatedCbCredentials',
    loginTokenErrorMain: 'loginTokenErrorMain',
    loginTokenErrorSecondary: 'loginTokenErrorSecondary',
    refreshTokenError:'refreshTokenError',
    setCredentialsError:'setCredentialsError',
    // success
    refreshTokenSuccess:'refreshTokenSuccess',
    cbLoginSuccessMain:'cbLoginSuccessMain',
    cbLoginSuccessSecondary:'cbLoginSuccessSecondary',
    accountTypeSuccess:'accountTypeSuccess'
}

type NotificationMessages = {
    [errorCode in keyof typeof errorCodes]:string
} 

export const notificationMessages:NotificationMessages = {
    missingCbCredentialsBoth: 'Ingresa sesion en ambas cuentas.',
    missingCbCredentialsMain: 'Ingresa sesion en la cuenta principal.',
    missingCbCredentialsSecondary: 'Ingresa sesion en la cuenta secundaria.',
    setCredentialsError: 'Error al guardar las credenciales.',
    cbLoginSuccessMain: 'Cuenta principal logueada con exito.',
    cbLoginSuccessSecondary: 'Cuenta secundaria logueada con exito.',
    accountTypeSuccess: 'Tipo de cuenta cambiada con exito.',
    loginTokenErrorMain: 'Error al iniciar sesion principal, intentelo denuevo.',
    loginTokenErrorSecondary: 'Error al iniciar sesion secundaria, intentelo denuevo.',
    duplicatedCbCredentials: 'La cuenta ya existe.',
    refreshTokenError:'Error al actualizar el token.',
    refreshTokenSuccess:'Token actualizado.'
  };
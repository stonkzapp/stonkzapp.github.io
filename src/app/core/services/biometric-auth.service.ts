import { Injectable } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { BiometricCapabilities, BiometricLoginRequest } from '../models/models';

declare global {
  interface Window {
    PublicKeyCredential?: any;
  }
}

declare var cordova: any;
declare var TouchID: any;
declare var FaceID: any;

@Injectable({
  providedIn: 'root',
})
export class BiometricAuthService {
  private isAndroid(): boolean {
    return /Android/i.test(navigator.userAgent);
  }

  private isIOS(): boolean {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  private isWebAuthnSupported(): boolean {
    return !!(
      window.PublicKeyCredential &&
      navigator.credentials &&
      navigator.credentials.create
    );
  }

  private isCordovaApp(): boolean {
    return typeof cordova !== 'undefined';
  }

  // Verificar capacidades biométricas disponíveis
  getBiometricCapabilities(): Observable<BiometricCapabilities> {
    return from(this.checkCapabilities());
  }

  private async checkCapabilities(): Promise<BiometricCapabilities> {
    const capabilities: BiometricCapabilities = {
      faceId: false,
      touchId: false,
      fingerprint: false,
      iris: false,
      voice: false,
      isAvailable: false,
      isEnrolled: false,
      supportedTypes: [],
    };

    try {
      if (this.isCordovaApp()) {
        // Cordova/PhoneGap app
        await this.checkCordovaCapabilities(capabilities);
      } else if (this.isWebAuthnSupported()) {
        // Web browser com WebAuthn
        await this.checkWebAuthnCapabilities(capabilities);
      } else {
        // Fallback para detecção básica por user agent
        this.checkBasicCapabilities(capabilities);
      }
    } catch (error) {
      console.warn('Erro ao verificar capacidades biométricas:', error);
    }

    return capabilities;
  }

  private async checkCordovaCapabilities(
    capabilities: BiometricCapabilities
  ): Promise<void> {
    if (typeof TouchID !== 'undefined') {
      try {
        const isAvailable = await new Promise(resolve => {
          TouchID.isAvailable(
            () => resolve(true),
            () => resolve(false)
          );
        });

        if (isAvailable) {
          capabilities.touchId = true;
          capabilities.isAvailable = true;
          capabilities.supportedTypes.push('touch_id');
        }
      } catch (error) {
        console.warn('TouchID não disponível:', error);
      }
    }

    if (typeof FaceID !== 'undefined') {
      try {
        const isAvailable = await new Promise(resolve => {
          FaceID.isAvailable(
            () => resolve(true),
            () => resolve(false)
          );
        });

        if (isAvailable) {
          capabilities.faceId = true;
          capabilities.isAvailable = true;
          capabilities.supportedTypes.push('face_id');
        }
      } catch (error) {
        console.warn('FaceID não disponível:', error);
      }
    }

    // Android Fingerprint
    if (this.isAndroid() && (window as any).Fingerprint) {
      try {
        const isAvailable = await new Promise(resolve => {
          (window as any).Fingerprint.isAvailable(
            () => resolve(true),
            () => resolve(false)
          );
        });

        if (isAvailable) {
          capabilities.fingerprint = true;
          capabilities.isAvailable = true;
          capabilities.supportedTypes.push('fingerprint');
        }
      } catch (error) {
        console.warn('Fingerprint não disponível:', error);
      }
    }
  }

  private async checkWebAuthnCapabilities(
    capabilities: BiometricCapabilities
  ): Promise<void> {
    try {
      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions =
        {
          challenge: new Uint8Array(32),
          rp: {
            name: 'Stonkz',
            id: window.location.hostname,
          },
          user: {
            id: new Uint8Array(16),
            name: 'test@stonkz.com',
            displayName: 'Test User',
          },
          pubKeyCredParams: [{ alg: -7, type: 'public-key' }],
          authenticatorSelection: {
            authenticatorAttachment: 'platform',
            userVerification: 'required',
          },
          timeout: 60000,
          attestation: 'none',
        };

      const available =
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();

      if (available) {
        capabilities.isAvailable = true;
        capabilities.supportedTypes.push('webauthn');

        // Tentar detectar tipos específicos baseado no user agent
        if (this.isIOS()) {
          capabilities.faceId = true;
          capabilities.touchId = true;
          capabilities.supportedTypes.push('face_id', 'touch_id');
        } else if (this.isAndroid()) {
          capabilities.fingerprint = true;
          capabilities.supportedTypes.push('fingerprint');
        } else {
          // Desktop - pode ser Windows Hello, etc.
          capabilities.supportedTypes.push('platform_authenticator');
        }
      }
    } catch (error) {
      console.warn('WebAuthn não disponível:', error);
    }
  }

  private checkBasicCapabilities(capabilities: BiometricCapabilities): void {
    // Detecção básica baseada no user agent
    if (this.isIOS()) {
      // iOS devices geralmente suportam Touch ID ou Face ID
      capabilities.faceId = true;
      capabilities.touchId = true;
      capabilities.isAvailable = true;
      capabilities.supportedTypes.push('face_id', 'touch_id');
    } else if (this.isAndroid()) {
      // Dispositivos Android geralmente suportam fingerprint
      capabilities.fingerprint = true;
      capabilities.isAvailable = true;
      capabilities.supportedTypes.push('fingerprint');
    }
  }

  // Realizar autenticação biométrica
  authenticate(biometricType?: string): Observable<BiometricLoginRequest> {
    return from(this.performAuthentication(biometricType));
  }

  private async performAuthentication(
    biometricType?: string
  ): Promise<BiometricLoginRequest> {
    const deviceId = this.getDeviceId();

    if (this.isCordovaApp()) {
      return this.authenticateWithCordova(biometricType, deviceId);
    } else if (this.isWebAuthnSupported()) {
      return this.authenticateWithWebAuthn(deviceId);
    } else {
      throw new Error(
        'Autenticação biométrica não suportada neste dispositivo'
      );
    }
  }

  private async authenticateWithCordova(
    biometricType: string | undefined,
    deviceId: string
  ): Promise<BiometricLoginRequest> {
    return new Promise((resolve, reject) => {
      const config = {
        clientId: 'Stonkz',
        clientSecret: 'stonkz-biometric-auth',
        disableBackup: true,
        localizedFallbackTitle: 'Usar Senha',
        localizedReason: 'Autentique-se para acessar sua conta',
      };

      if (biometricType === 'face_id' && typeof FaceID !== 'undefined') {
        FaceID.show(
          config,
          () => {
            resolve({
              biometricType: 'face_id',
              deviceId,
              challenge: this.generateChallenge(),
            });
          },
          (error: any) => reject(new Error(`Face ID failed: ${error}`))
        );
      } else if (
        biometricType === 'touch_id' &&
        typeof TouchID !== 'undefined'
      ) {
        TouchID.verifyFingerprint(
          'Autentique-se para acessar sua conta',
          () => {
            resolve({
              biometricType: 'touch_id',
              deviceId,
              challenge: this.generateChallenge(),
            });
          },
          (error: any) => reject(new Error(`Touch ID failed: ${error}`))
        );
      } else if (this.isAndroid() && (window as any).Fingerprint) {
        (window as any).Fingerprint.show(
          {
            clientId: 'Stonkz',
            clientSecret: 'stonkz-fingerprint-auth',
            localizedReason: 'Autentique-se para acessar sua conta',
          },
          () => {
            resolve({
              biometricType: 'fingerprint',
              deviceId,
              challenge: this.generateChallenge(),
            });
          },
          (error: any) => reject(new Error(`Fingerprint failed: ${error}`))
        );
      } else {
        reject(new Error('Tipo de autenticação biométrica não suportado'));
      }
    });
  }

  private async authenticateWithWebAuthn(
    deviceId: string
  ): Promise<BiometricLoginRequest> {
    try {
      const challenge = this.generateChallengeBytes();

      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions =
        {
          challenge,
          timeout: 60000,
          userVerification: 'required',
        };

      const credential = (await navigator.credentials!.get({
        publicKey: publicKeyCredentialRequestOptions,
      })) as PublicKeyCredential;

      const response = credential.response as AuthenticatorAssertionResponse;

      return {
        biometricType: this.detectBiometricType(),
        deviceId,
        challenge: btoa(String.fromCharCode(...new Uint8Array(challenge))),
        signature: btoa(
          String.fromCharCode(...new Uint8Array(response.signature))
        ),
        publicKey: btoa(
          String.fromCharCode(...new Uint8Array(response.authenticatorData))
        ),
      };
    } catch (error) {
      throw new Error(`WebAuthn authentication failed: ${error}`);
    }
  }

  private detectBiometricType():
    | 'face_id'
    | 'touch_id'
    | 'fingerprint'
    | 'iris'
    | 'voice' {
    if (this.isIOS()) {
      // iOS 11+ geralmente usa Face ID, versões anteriores Touch ID
      const iOS = /OS (\d+)_/.exec(navigator.userAgent);
      const version = iOS ? parseInt(iOS[1], 10) : 0;
      return version >= 11 ? 'face_id' : 'touch_id';
    } else if (this.isAndroid()) {
      return 'fingerprint';
    } else {
      return 'fingerprint'; // Fallback
    }
  }

  private generateChallenge(): string {
    return btoa(
      Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
  }

  private generateChallengeBytes(): Uint8Array {
    return new Uint8Array(
      Array.from({ length: 32 }, () => Math.floor(Math.random() * 256))
    );
  }

  private getDeviceId(): string {
    // Tentar obter um ID único do dispositivo
    let deviceId = localStorage.getItem('stonkz_device_id');

    if (!deviceId) {
      // Gerar um novo ID baseado em características do dispositivo
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);

      const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        canvas.toDataURL(),
      ].join('|');

      deviceId = btoa(fingerprint)
        .replace(/[^a-zA-Z0-9]/g, '')
        .substring(0, 32);
      localStorage.setItem('stonkz_device_id', deviceId);
    }

    return deviceId;
  }

  // Verificar se o usuário já está registrado para autenticação biométrica
  isBiometricEnrolled(): Observable<boolean> {
    const enrolled =
      localStorage.getItem('stonkz_biometric_enrolled') === 'true';
    return of(enrolled);
  }

  // Marcar usuário como registrado para autenticação biométrica
  setBiometricEnrolled(enrolled: boolean): void {
    localStorage.setItem('stonkz_biometric_enrolled', enrolled.toString());
  }

  // Limpar dados biométricos
  clearBiometricData(): void {
    localStorage.removeItem('stonkz_biometric_enrolled');
    localStorage.removeItem('stonkz_device_id');
  }
}

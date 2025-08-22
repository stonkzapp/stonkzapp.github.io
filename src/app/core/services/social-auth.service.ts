import { Injectable } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { AuthProvider, SocialLoginRequest } from '../models/models';

declare global {
  interface Window {
    gapi?: any;
    google?: any;
    AppleID?: any;
    FB?: any;
    Microsoft?: any;
  }
}

@Injectable({
  providedIn: 'root',
})
export class SocialAuthService {
  private readonly GOOGLE_CLIENT_ID =
    'your-google-client-id.apps.googleusercontent.com';
  private readonly FACEBOOK_APP_ID = 'your-facebook-app-id';
  private readonly MICROSOFT_CLIENT_ID = 'your-microsoft-client-id';
  private readonly APPLE_CLIENT_ID = 'your-apple-service-id';

  private googleLoaded = false;
  private facebookLoaded = false;
  private microsoftLoaded = false;
  private appleLoaded = false;

  constructor() {
    this.loadSDKs();
  }

  // Carregar SDKs dos provedores sociais
  private loadSDKs(): void {
    this.loadGoogleSDK();
    this.loadFacebookSDK();
    this.loadMicrosoftSDK();
    this.loadAppleSDK();
  }

  // Google Sign-In
  private loadGoogleSDK(): void {
    if (window.google) {
      this.googleLoaded = true;
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.googleLoaded = true;
      this.initializeGoogle();
    };
    document.head.appendChild(script);
  }

  private initializeGoogle(): void {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: this.GOOGLE_CLIENT_ID,
        callback: () => {}, // Será definido quando necessário
      });
    }
  }

  loginWithGoogle(): Observable<SocialLoginRequest> {
    return new Observable(observer => {
      if (!this.googleLoaded || !window.google) {
        observer.error(new Error('Google SDK não carregado'));
        return;
      }

      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback para o popup
          this.openGooglePopup().then(
            result => observer.next(result),
            error => observer.error(error)
          );
        }
      });

      // Configurar callback para o One Tap
      window.google.accounts.id.initialize({
        client_id: this.GOOGLE_CLIENT_ID,
        callback: (response: any) => {
          observer.next({
            provider: 'google',
            token: response.credential,
          });
          observer.complete();
        },
      });
    });
  }

  private async openGooglePopup(): Promise<SocialLoginRequest> {
    return new Promise((resolve, reject) => {
      window.google.accounts.oauth2
        .initTokenClient({
          client_id: this.GOOGLE_CLIENT_ID,
          scope: 'email profile',
          callback: (response: any) => {
            if (response.access_token) {
              resolve({
                provider: 'google',
                token: response.access_token,
              });
            } else {
              reject(new Error('Falha na autenticação Google'));
            }
          },
        })
        .requestAccessToken();
    });
  }

  // Facebook Login
  private loadFacebookSDK(): void {
    if (window.FB) {
      this.facebookLoaded = true;
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/pt_BR/sdk.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.FB.init({
        appId: this.FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0',
      });
      this.facebookLoaded = true;
    };
    document.head.appendChild(script);
  }

  loginWithFacebook(): Observable<SocialLoginRequest> {
    return new Observable(observer => {
      if (!this.facebookLoaded || !window.FB) {
        observer.error(new Error('Facebook SDK não carregado'));
        return;
      }

      window.FB.login(
        (response: any) => {
          if (response.authResponse) {
            observer.next({
              provider: 'facebook',
              token: response.authResponse.accessToken,
            });
            observer.complete();
          } else {
            observer.error(new Error('Falha na autenticação Facebook'));
          }
        },
        { scope: 'email,public_profile' }
      );
    });
  }

  // Microsoft/Azure AD
  private loadMicrosoftSDK(): void {
    const script = document.createElement('script');
    script.src =
      'https://alcdn.msauth.net/browser/2.30.0/js/msal-browser.min.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.microsoftLoaded = true;
    };
    document.head.appendChild(script);
  }

  loginWithMicrosoft(): Observable<SocialLoginRequest> {
    return new Observable(observer => {
      if (!this.microsoftLoaded) {
        observer.error(new Error('Microsoft SDK não carregado'));
        return;
      }

      // Implementação básica - você pode expandir com MSAL
      const authUrl =
        `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
        `client_id=${this.MICROSOFT_CLIENT_ID}&` +
        `response_type=code&` +
        `redirect_uri=${encodeURIComponent(
          window.location.origin + '/auth/callback/microsoft'
        )}&` +
        `scope=${encodeURIComponent('openid email profile')}&` +
        `response_mode=fragment`;

      const popup = window.open(
        authUrl,
        'microsoft-login',
        'width=500,height=600'
      );

      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          observer.error(new Error('Login cancelado'));
        }
      }, 1000);

      // Escutar mensagem do popup
      window.addEventListener('message', event => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'microsoft-auth-success') {
          clearInterval(checkClosed);
          popup?.close();
          observer.next({
            provider: 'microsoft',
            code: event.data.code,
            state: event.data.state,
          });
          observer.complete();
        } else if (event.data.type === 'microsoft-auth-error') {
          clearInterval(checkClosed);
          popup?.close();
          observer.error(new Error(event.data.error));
        }
      });
    });
  }

  // Apple Sign In
  private loadAppleSDK(): void {
    const script = document.createElement('script');
    script.src =
      'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.appleLoaded = true;
      this.initializeApple();
    };
    document.head.appendChild(script);
  }

  private initializeApple(): void {
    if (window.AppleID) {
      window.AppleID.auth.init({
        clientId: this.APPLE_CLIENT_ID,
        scope: 'name email',
        redirectURI: window.location.origin + '/auth/callback/apple',
        usePopup: true,
      });
    }
  }

  loginWithApple(): Observable<SocialLoginRequest> {
    return new Observable(observer => {
      if (!this.appleLoaded || !window.AppleID) {
        observer.error(new Error('Apple SDK não carregado'));
        return;
      }

      window.AppleID.auth.signIn().then(
        (response: any) => {
          observer.next({
            provider: 'apple',
            code: response.authorization.code,
            state: response.authorization.state,
          });
          observer.complete();
        },
        (error: any) => {
          observer.error(new Error(`Falha na autenticação Apple: ${error}`));
        }
      );
    });
  }

  // GitHub OAuth (usando popup)
  loginWithGitHub(): Observable<SocialLoginRequest> {
    return new Observable(observer => {
      const clientId = 'your-github-client-id';
      const redirectUri = encodeURIComponent(
        window.location.origin + '/auth/callback/github'
      );
      const scope = encodeURIComponent('user:email');
      const state = this.generateState();

      const authUrl =
        `https://github.com/login/oauth/authorize?` +
        `client_id=${clientId}&` +
        `redirect_uri=${redirectUri}&` +
        `scope=${scope}&` +
        `state=${state}`;

      const popup = window.open(
        authUrl,
        'github-login',
        'width=500,height=600'
      );

      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          observer.error(new Error('Login cancelado'));
        }
      }, 1000);

      // Escutar mensagem do popup
      window.addEventListener('message', event => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === 'github-auth-success') {
          clearInterval(checkClosed);
          popup?.close();
          observer.next({
            provider: 'github',
            code: event.data.code,
            state: event.data.state,
          });
          observer.complete();
        } else if (event.data.type === 'github-auth-error') {
          clearInterval(checkClosed);
          popup?.close();
          observer.error(new Error(event.data.error));
        }
      });
    });
  }

  // Métodos auxiliares
  private generateState(): string {
    return btoa(
      Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
  }

  // Verificar se um provedor está disponível
  isProviderAvailable(provider: AuthProvider): boolean {
    switch (provider) {
      case 'google':
        return this.googleLoaded && !!window.google;
      case 'facebook':
        return this.facebookLoaded && !!window.FB;
      case 'microsoft':
        return this.microsoftLoaded;
      case 'apple':
        return this.appleLoaded && !!window.AppleID;
      case 'github':
        return true; // Não requer SDK específico
      default:
        return false;
    }
  }

  // Fazer logout de todos os provedores
  logoutFromAllProviders(): void {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }

    if (window.FB) {
      window.FB.logout();
    }

    if (window.AppleID) {
      // Apple não possui método de logout explícito
    }
  }

  // Obter informações do perfil do usuário (após autenticação)
  getUserProfile(provider: AuthProvider, token: string): Observable<any> {
    switch (provider) {
      case 'google':
        return this.getGoogleUserProfile(token);
      case 'facebook':
        return this.getFacebookUserProfile(token);
      default:
        return throwError(
          () => new Error(`Perfil do usuário não suportado para ${provider}`)
        );
    }
  }

  private getGoogleUserProfile(token: string): Observable<any> {
    return from(
      fetch(
        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token}`
      ).then(response => response.json())
    );
  }

  private getFacebookUserProfile(token: string): Observable<any> {
    return new Observable(observer => {
      if (window.FB) {
        window.FB.api(
          '/me',
          { fields: 'name,email,picture' },
          (response: any) => {
            if (response && !response.error) {
              observer.next(response);
              observer.complete();
            } else {
              observer.error(new Error('Erro ao obter perfil do Facebook'));
            }
          }
        );
      } else {
        observer.error(new Error('Facebook SDK não disponível'));
      }
    });
  }
}

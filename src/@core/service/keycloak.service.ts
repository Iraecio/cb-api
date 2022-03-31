import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Auth } from '../../models/auth.model';
import { ConfigService } from '@nestjs/config';
import { Logout } from '../../models/logout.model';
import { UserKc } from '../../models/user-kc.model';
import { UserCreateInput } from '../../resolvers/user/input/user-create.input';

//Reactive X
@Injectable()
export class KeycloakService {
  baseUrl = '';
  adminBaseUrl = '';
  realmsUrl = '';

  constructor(private config: ConfigService, private http: HttpService) {
    this.baseUrl = `${config.get('KEYCLOAK_BASE_URL')}/realms/${config.get(
      'CABIR_REALM'
    )}/protocol/openid-connect`;
    this.adminBaseUrl = `${config.get('KEYCLOAK_BASE_URL')}/realms/${config.get(
      'KEYCLOAK_ADMIN_REALM'
    )}/protocol/openid-connect`;
    this.realmsUrl = `${config.get(
      'KEYCLOAK_BASE_URL'
    )}/admin/realms/${config.get('CABIR_REALM')}`;
  }

  async login(
    username: string,
    password: string,
    grantType = 'password'
  ): Promise<Auth> {
    try {
      const { data } = await firstValueFrom(
        this.http.post(
          `${this.baseUrl}/token`,
          new URLSearchParams({
            client_id: this.config.get('CABIR_CLIENT_ID'),
            client_secret: this.config.get('CABIR_CLIENT_SECRET'),
            grant_type: grantType,
            username,
            password,
          })
        )
      );

      return data;
    } catch (err) {
      throw new HttpException(
        err?.response?.data?.error_description,
        err?.response?.status
      );
    }
  }

  async refresh(refresh: string): Promise<Auth> {
    if (!refresh) {
      throw new HttpException('No refresh passed in call', 500);
    }

    try {
      const { data } = await firstValueFrom(
        this.http.post(
          `${this.baseUrl}/token`,
          new URLSearchParams({
            client_id: this.config.get('CABIR_CLIENT_ID'),
            client_secret: this.config.get('CABIR_CLIENT_SECRET'),
            refresh_token: refresh,
            grant_type: 'refresh_token',
          })
        )
      );

      return data;
    } catch (err) {
      throw new HttpException(
        err?.response?.data?.error_description,
        err?.response?.status
      );
    }
  }

  async logout(refresh: string): Promise<Logout> {
    if (!refresh) {
      throw new HttpException('No refresh passed in call', 500);
    }

    try {
      const data = await firstValueFrom(
        this.http.post(
          `${this.baseUrl}/logout`,
          new URLSearchParams({
            client_id: this.config.get('CABIR_CLIENT_ID'),
            client_secret: this.config.get('CABIR_CLIENT_SECRET'),
            refresh_token: refresh,
          })
        )
      );

      if (data?.status !== 204) {
        throw new HttpException('Error of logout', 500);
      }

      return { status: 204, message: 'Logout successful', redirectUri: '/' };
    } catch (err) {
      throw new HttpException(
        err?.response?.data?.error_description,
        err?.response?.status
      );
    }
  }

  async userInfo(token: string): Promise<UserKc> {
    try {
      const { data } = await firstValueFrom(
        this.http.post(
          `${this.baseUrl}/userinfo`,
          new URLSearchParams({
            client_id: this.config.get('CABIR_CLIENT_ID'),
            client_secret: this.config.get('CABIR_CLIENT_SECRET'),
          }),
          {
            headers: {
              authorization: `bearer ${token}`,
            },
          }
        )
      );

      return data;
    } catch (err) {
      throw new HttpException(
        err?.response?.data?.error_description,
        err?.response?.status
      );
    }
  }

  async createUser(dados: UserCreateInput): Promise<any> {
    try {
      const { token_type, access_token } = await this.getAdminAccess();
      const { data } = await firstValueFrom(
        this.http.post(`${this.realmsUrl}/users`, JSON.stringify(dados), {
          headers: {
            'Content-Type': 'application/json',
            authorization: `${token_type} ${access_token}`,
          },
        })
      );

      return data;
    } catch (err) {
      throw new HttpException(
        err?.response?.data?.errorMessage,
        err?.response?.status
      );
    }
  }

  async getAdminAccess(): Promise<any> {
    try {
      const { data } = await firstValueFrom(
        this.http.post(
          `${this.adminBaseUrl}/token`,
          new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: this.config.get('KEYCLOAK_ADMIN_CLIENT_ID'),
            client_secret: this.config.get('KEYCLOAK_ADMIN_CLIENT_SECRET'),
          })
        )
      );

      return data;
    } catch (err) {
      throw new HttpException(
        err?.response?.data?.error_description,
        err?.response?.status
      );
    }
  }
}

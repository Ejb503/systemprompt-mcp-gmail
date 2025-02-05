import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

interface GoogleCredentials {
  web?: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
  };
  installed?: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
  };
}

export class GoogleAuthService {
  private static instance: GoogleAuthService;
  private oAuth2Client: OAuth2Client | null = null;

  private constructor() {}

  static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }

  async initialize(): Promise<void> {
    try {
      const credentialsBase64 = process.env.GOOGLE_CREDENTIALS;
      if (!credentialsBase64) {
        throw new Error("GOOGLE_CREDENTIALS environment variable is not set");
      }

      const credentials: GoogleCredentials = JSON.parse(
        Buffer.from(credentialsBase64, "base64").toString(),
      );

      // Handle both web and installed credentials
      const { client_secret, client_id, redirect_uris } =
        credentials.web ||
        credentials.installed ||
        (() => {
          throw new Error("Invalid credentials format: missing web or installed configuration");
        })();

      this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

      const tokenBase64 = process.env.GOOGLE_TOKEN;
      try {
        if (tokenBase64) {
          const token = JSON.parse(Buffer.from(tokenBase64, "base64").toString());
          this.oAuth2Client.setCredentials(token);
        }
      } catch (error) {
        console.error("Error parsing token:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error loading Google credentials:", error);
      throw error;
    }
  }

  getAuth(): OAuth2Client {
    if (!this.oAuth2Client) {
      throw new Error("OAuth2Client not initialized");
    }
    return this.oAuth2Client;
  }
}

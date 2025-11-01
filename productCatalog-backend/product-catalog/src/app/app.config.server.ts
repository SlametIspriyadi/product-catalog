import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config'; // <-- Ini config utama Anda

// Ini adalah config KHUSUS server
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering() // <-- Hanya ini yang kita perlukan
  ]
};

// Ini menggabungkan config utama (appConfig) dengan config server
export const config = mergeApplicationConfig(appConfig, serverConfig);
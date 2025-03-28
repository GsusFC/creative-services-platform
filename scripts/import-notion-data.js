#!/usr/bin/env node
"use strict";
/**
 * Script para importar datos completos desde Notion
 *
 * Este script utiliza las funciones existentes en el proyecto para importar
 * todos los casos de estudio desde Notion y guardarlos localmente.
 *
 * Uso:
 * npx ts-node --esm scripts/import-notion-data.ts
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var url_1 = require("url");
var path_1 = require("path");
var fs_1 = require("fs");
var service_js_1 = require("../src/lib/notion/service.js");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = (0, path_1.dirname)(__filename);
// Cargar variables de entorno
(0, dotenv_1.config)({ path: (0, path_1.resolve)(process.cwd(), '.env.local') });
// Directorio para almacenar los datos
var DATA_DIR = (0, path_1.resolve)(process.cwd(), 'data');
var CASE_STUDIES_FILE = (0, path_1.join)(DATA_DIR, 'case-studies.json');
// Asegurar que el directorio de datos existe
if (!(0, fs_1.existsSync)(DATA_DIR)) {
    (0, fs_1.mkdirSync)(DATA_DIR, { recursive: true });
}
/**
 * Guarda los casos de estudio en un archivo local
 */
function saveToLocalStorage(studies) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                (0, fs_1.writeFileSync)(CASE_STUDIES_FILE, JSON.stringify(studies, null, 2), 'utf-8');
                console.log("\u2705 Datos guardados en ".concat(CASE_STUDIES_FILE));
            }
            catch (error) {
                console.error('❌ Error al guardar datos localmente:', error);
                throw error;
            }
            return [2 /*return*/];
        });
    });
}
/**
 * Función principal para importar datos desde Notion
 */
function importFromNotion() {
    return __awaiter(this, void 0, void 0, function () {
        var databaseId, apiKey, notionService, studies, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🔄 Importando datos desde Notion...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    databaseId = process.env['NEXT_PUBLIC_NOTION_DATABASE_ID'];
                    apiKey = process.env['NEXT_PUBLIC_NOTION_API_KEY'];
                    if (!databaseId || !apiKey) {
                        throw new Error('Variables de entorno no configuradas. Verifica NEXT_PUBLIC_NOTION_DATABASE_ID y NEXT_PUBLIC_NOTION_API_KEY');
                    }
                    console.log("\uD83D\uDCCB Usando base de datos: ".concat(databaseId));
                    notionService = new service_js_1.NotionService();
                    return [4 /*yield*/, notionService.getAllCaseStudies()];
                case 2:
                    studies = _a.sent();
                    console.log("\u2705 Se obtuvieron ".concat(studies.length, " casos de estudio de Notion"));
                    // Mostrar títulos de los casos de estudio
                    studies.forEach(function (study, index) {
                        console.log("  ".concat(index + 1, ". ").concat(study.title, " (").concat(study.status, ")"));
                    });
                    // Guardar datos localmente
                    return [4 /*yield*/, saveToLocalStorage(studies)];
                case 3:
                    // Guardar datos localmente
                    _a.sent();
                    console.log('✅ Importación completada con éxito');
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('❌ Error durante la importación:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Ejecutar la función principal
importFromNotion();

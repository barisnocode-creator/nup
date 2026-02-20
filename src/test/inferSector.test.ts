import { describe, it, expect } from "vitest";
import { inferSectorFromFormData, resolveEffectiveSector } from "@/utils/inferSector";

describe("inferSectorFromFormData", () => {
  it("returns empty string for null input", () => {
    expect(inferSectorFromFormData(null)).toBe("");
  });

  it("returns empty string for undefined input", () => {
    expect(inferSectorFromFormData(undefined)).toBe("");
  });

  it("detects doctor from businessName", () => {
    const result = inferSectorFromFormData({
      businessName: "Dr. Ahmet Klinik",
    });
    expect(result).toBe("doctor");
  });

  it("detects dentist from businessName", () => {
    const result = inferSectorFromFormData({
      businessName: "Güler Diş Kliniği",
    });
    expect(result).toBe("dentist");
  });

  it("detects pharmacy from businessName", () => {
    const result = inferSectorFromFormData({
      businessName: "Merkez Eczanesi",
    });
    expect(result).toBe("pharmacy");
  });

  it("detects lawyer from businessName", () => {
    const result = inferSectorFromFormData({
      businessName: "Yılmaz Hukuk Bürosu",
    });
    expect(result).toBe("lawyer");
  });

  it("detects cafe from businessName", () => {
    const result = inferSectorFromFormData({
      businessName: "Aroma Coffee & Cafe",
    });
    expect(result).toBe("cafe");
  });

  it("detects gym from services array", () => {
    const result = inferSectorFromFormData({
      services: ["pilates dersleri", "yoga seansı", "fitness antrenmanı"],
    });
    expect(result).toBe("gym");
  });

  it("detects hotel from businessName", () => {
    const result = inferSectorFromFormData({
      businessName: "Bosphorus Butik Otel",
    });
    expect(result).toBe("hotel");
  });

  it("detects beauty_salon from businessName", () => {
    const result = inferSectorFromFormData({
      businessName: "Gül Güzellik Salonu",
    });
    expect(result).toBe("beauty_salon");
  });

  it("detects veterinary from businessName", () => {
    const result = inferSectorFromFormData({
      businessName: "Patili Dostlar Veteriner Kliniği",
    });
    expect(result).toBe("veterinary");
  });

  it("handles Turkish characters correctly (ı, ş, ğ, ü, ö, ç)", () => {
    const result = inferSectorFromFormData({
      businessName: "Şimşek Güzellik Merkezi",
    });
    expect(result).toBe("beauty_salon");
  });

  it("scans extractedData.businessName", () => {
    const result = inferSectorFromFormData({
      extractedData: { businessName: "Dr. Zeynep Kardiyoloji Kliniği" },
    });
    expect(result).toBe("doctor");
  });

  it("returns empty string when no keywords match", () => {
    const result = inferSectorFromFormData({
      businessName: "XYZ Ltd Teknoloji Hizmetleri",
    });
    expect(result).toBe("");
  });
});

describe("resolveEffectiveSector", () => {
  it("returns empty string for null", () => {
    expect(resolveEffectiveSector(null)).toBe("");
  });

  it("uses businessType directly when not generic", () => {
    const result = resolveEffectiveSector({ businessType: "dentist" });
    expect(result).toBe("dentist");
  });

  it("normalizes businessType to lowercase with underscores", () => {
    const result = resolveEffectiveSector({ businessType: "Beauty Salon" });
    expect(result).toBe("beauty_salon");
  });

  it("falls back to inference when businessType is generic", () => {
    const result = resolveEffectiveSector({
      businessType: "other",
      businessName: "Güler Diş Kliniği",
    });
    expect(result).toBe("dentist");
  });

  it("falls back to inference when businessType is 'service'", () => {
    const result = resolveEffectiveSector({
      businessType: "service",
      businessName: "Arı Eczanesi",
    });
    expect(result).toBe("pharmacy");
  });

  it("uses sector field when businessType is absent", () => {
    const result = resolveEffectiveSector({ sector: "lawyer" });
    expect(result).toBe("lawyer");
  });
});

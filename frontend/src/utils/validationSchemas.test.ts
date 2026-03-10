import { describe, it, expect } from 'vitest';
import { personValidationSchema, legalEntityValidationSchema } from './validationSchemas';

describe('Validation Schemas', () => {
  describe('personValidationSchema', () => {
    it('should validate correct person data', async () => {
      const validData = {
        name: 'João Silva Santos',
        cpf: '12345678901',
        age: 30,
        monthlyIncome: 5000,
        city: 'São Paulo',
      };
      await expect(personValidationSchema.validate(validData)).resolves.toEqual(validData);
    });

    it('should reject name shorter than 8 characters', async () => {
      const invalidData = {
        name: 'João',
        cpf: '12345678901',
        age: 30,
        monthlyIncome: 5000,
        city: 'São Paulo',
      };
      await expect(personValidationSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject age less than 18', async () => {
      const invalidData = {
        name: 'João Silva Santos',
        cpf: '12345678901',
        age: 17,
        monthlyIncome: 5000,
        city: 'São Paulo',
      };
      await expect(personValidationSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject CPF with less than 11 characters', async () => {
      const invalidData = {
        name: 'João Silva Santos',
        cpf: '1234567890',
        age: 30,
        monthlyIncome: 5000,
        city: 'São Paulo',
      };
      await expect(personValidationSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject CPF with non-numeric characters', async () => {
      const invalidData = {
        name: 'João Silva Santos',
        cpf: 'abc12345678',
        age: 30,
        monthlyIncome: 5000,
        city: 'São Paulo',
      };
      await expect(personValidationSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject monthly income less than 0.01', async () => {
      const invalidData = {
        name: 'João Silva Santos',
        cpf: '12345678901',
        age: 30,
        monthlyIncome: 0,
        city: 'São Paulo',
      };
      await expect(personValidationSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject empty city', async () => {
      const invalidData = {
        name: 'João Silva Santos',
        cpf: '12345678901',
        age: 30,
        monthlyIncome: 5000,
        city: '',
      };
      await expect(personValidationSchema.validate(invalidData)).rejects.toThrow();
    });
  });

  describe('legalEntityValidationSchema', () => {
    it('should validate correct legal entity data', async () => {
      const validData = {
        companyName: 'Empresa Ltda',
        cnpj: '12345678901234',
        monthlyRevenue: 50000,
        city: 'São Paulo',
      };
      await expect(legalEntityValidationSchema.validate(validData)).resolves.toEqual(validData);
    });

    it('should reject company name shorter than 8 characters', async () => {
      const invalidData = {
        companyName: 'Empresa',
        cnpj: '12345678901234',
        monthlyRevenue: 50000,
        city: 'São Paulo',
      };
      await expect(legalEntityValidationSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject CNPJ with less than 14 characters', async () => {
      const invalidData = {
        companyName: 'Empresa Ltda',
        cnpj: '1234567890123',
        monthlyRevenue: 50000,
        city: 'São Paulo',
      };
      await expect(legalEntityValidationSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject CNPJ with non-numeric characters', async () => {
      const invalidData = {
        companyName: 'Empresa Ltda',
        cnpj: 'abc12345678901',
        monthlyRevenue: 50000,
        city: 'São Paulo',
      };
      await expect(legalEntityValidationSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should reject monthly revenue less than 500', async () => {
      const invalidData = {
        companyName: 'Empresa Ltda',
        cnpj: '12345678901234',
        monthlyRevenue: 499,
        city: 'São Paulo',
      };
      await expect(legalEntityValidationSchema.validate(invalidData)).rejects.toThrow();
    });

    it('should accept monthly revenue equal to 500', async () => {
      const validData = {
        companyName: 'Empresa Ltda',
        cnpj: '12345678901234',
        monthlyRevenue: 500,
        city: 'São Paulo',
      };
      await expect(legalEntityValidationSchema.validate(validData)).resolves.toEqual(validData);
    });

    it('should reject empty city', async () => {
      const invalidData = {
        companyName: 'Empresa Ltda',
        cnpj: '12345678901234',
        monthlyRevenue: 50000,
        city: '',
      };
      await expect(legalEntityValidationSchema.validate(invalidData)).rejects.toThrow();
    });
  });
});

// ========================================
// MONGODB OBJECTID UTILITY
// ========================================
// Generates MongoDB-compatible ObjectIDs on the frontend
// This ensures consistency between frontend and backend

/**
 * Generates a MongoDB-compatible ObjectId string
 * Format: 24 hex characters (12 bytes)
 * 
 * Structure:
 * - 4 bytes: timestamp (seconds since epoch)
 * - 5 bytes: random value
 * - 3 bytes: incrementing counter
 */
export function generateObjectId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const randomValue = Array.from({ length: 10 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  const counter = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  
  return timestamp + randomValue + counter;
}

/**
 * Validates if a string is a valid MongoDB ObjectId
 * @param id - The ID to validate
 * @returns true if valid ObjectId format
 */
export function isValidObjectId(id: string | number | undefined | null): boolean {
  if (!id) return false;
  const idStr = String(id);
  return /^[0-9a-fA-F]{24}$/.test(idStr);
}

/**
 * Safely extracts ID from MongoDB document
 * Handles both _id and id fields
 */
export function extractId(doc: any): string | undefined {
  if (!doc) return undefined;
  return doc._id || doc.id;
}

/**
 * Converts legacy numeric IDs to ObjectIds
 * Used for migration from old data
 */
export function migrateId(oldId: string | number | undefined): string {
  if (!oldId) return generateObjectId();
  
  const idStr = String(oldId);
  
  // If already a valid ObjectId, return as is
  if (isValidObjectId(idStr)) {
    return idStr;
  }
  
  // Generate new ObjectId for invalid formats
  return generateObjectId();
}

/**
 * Prepares document for API submission
 * Ensures ID format is correct
 */
export function prepareForApi<T extends Record<string, any>>(
  doc: T,
  isNew: boolean = false
): T {
  const prepared = { ...doc };
  
  if (isNew) {
    // Generate new ObjectId for new documents
    if (!prepared._id) {
      prepared._id = generateObjectId();
    }
    // Remove simple numeric id if it exists
    delete prepared.id;
  } else {
    // For updates, ensure we have a valid ID
    const existingId = prepared._id || prepared.id;
    if (existingId && !isValidObjectId(existingId)) {
      console.warn('Invalid ID detected, generating new ObjectId:', existingId);
      prepared._id = generateObjectId();
    } else if (existingId) {
      prepared._id = String(existingId);
    }
    // Remove numeric id to avoid conflicts
    delete prepared.id;
  }
  
  return prepared;
}

/**
 * Normalizes document from API response
 * Ensures consistent ID field usage
 */
export function normalizeFromApi<T extends Record<string, any>>(doc: T): T & { id: string } {
  const normalized = { ...doc };
  
  // Use _id from MongoDB or fallback to id
  const mongoId = normalized._id || normalized.id;
  
  // Set both _id and id for compatibility
  if (mongoId) {
    normalized._id = String(mongoId);
    normalized.id = String(mongoId);
  } else {
    // Generate new ID if none exists
    const newId = generateObjectId();
    normalized._id = newId;
    normalized.id = newId;
  }
  
  return normalized as T & { id: string };
}

/**
 * Migrates array of documents from legacy IDs to ObjectIds
 */
export function migrateDocuments<T extends Record<string, any>>(docs: T[]): T[] {
  return docs.map(doc => {
    const migrated = { ...doc };
    const oldId = migrated.id || migrated._id;
    
    if (!isValidObjectId(oldId)) {
      // Generate new ObjectId
      const newId = generateObjectId();
      migrated._id = newId;
      migrated.id = newId;
      
      console.log(`Migrated ID: ${oldId} -> ${newId}`);
    } else {
      // Normalize existing valid ObjectId
      const validId = String(oldId);
      migrated._id = validId;
      migrated.id = validId;
    }
    
    return migrated;
  });
}

export default {
  generateObjectId,
  isValidObjectId,
  extractId,
  migrateId,
  prepareForApi,
  normalizeFromApi,
  migrateDocuments
};

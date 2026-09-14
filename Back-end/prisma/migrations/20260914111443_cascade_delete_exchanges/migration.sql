-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exchange" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "topic" TEXT,
    "lang" TEXT,
    "matched" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Exchange_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Exchange" ("conversationId", "createdAt", "id", "lang", "matched", "message", "response", "topic") SELECT "conversationId", "createdAt", "id", "lang", "matched", "message", "response", "topic" FROM "Exchange";
DROP TABLE "Exchange";
ALTER TABLE "new_Exchange" RENAME TO "Exchange";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

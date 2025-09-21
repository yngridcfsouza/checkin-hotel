-- AlterTable
ALTER TABLE "public"."MagicLink" ADD COLUMN     "role" "public"."Role" NOT NULL DEFAULT 'GUEST';

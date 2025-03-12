-- CreateTable
CREATE TABLE "sales_reports" (
    "id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "total_sales" DECIMAL(15,2) NOT NULL,
    "total_products_sold" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_reports_pkey" PRIMARY KEY ("id")
);

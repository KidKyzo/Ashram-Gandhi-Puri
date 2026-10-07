import { S3Client, HeadBucketCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

async function testBucket() {
  const bucket =
    process.env.S3_BUCKET ||
    process.env.BUCKET_NAME ||
    process.env.R2_BUCKET;

  const rawEndpoint =
    process.env.S3_ENDPOINT ||
    process.env.AWS_ENDPOINT_URL_S3 ||
    process.env.AWS_ENDPOINT ||
    process.env.R2_ENDPOINT;

  const accessKeyId =
    process.env.S3_ACCESS_KEY_ID ||
    process.env.AWS_ACCESS_KEY_ID ||
    process.env.R2_ACCESS_KEY_ID;

  const secretAccessKey =
    process.env.S3_SECRET_ACCESS_KEY ||
    process.env.AWS_SECRET_ACCESS_KEY ||
    process.env.R2_SECRET_ACCESS_KEY;

  const publicUrl = process.env.S3_PUBLIC_URL || process.env.R2_PUBLIC_URL;

  console.log("=== BUCKET STORAGE VERIFICATION ===");

  if (!bucket || !rawEndpoint || !accessKeyId || !secretAccessKey) {
    console.log("⚠ Bucket is currently NOT active because environment variables are not set in .env:");
    console.log(`   - S3_BUCKET / BUCKET_NAME: ${bucket ? "✓ Set (" + bucket + ")" : "✗ Missing"}`);
    console.log(`   - S3_ENDPOINT: ${rawEndpoint ? "✓ Set" : "✗ Missing"}`);
    console.log(`   - S3_ACCESS_KEY_ID: ${accessKeyId ? "✓ Set" : "✗ Missing"}`);
    console.log(`   - S3_SECRET_ACCESS_KEY: ${secretAccessKey ? "✓ Set" : "✗ Missing"}`);
    console.log(`   - S3_PUBLIC_URL (optional): ${publicUrl ? "✓ Set" : "○ Not set"}`);
    console.log("\nPayload CMS is currently falling back to local file storage (media/ folder).");
    console.log("To connect Neon Object Storage, add these variables to your .env file or Vercel environment.");
    return;
  }

  const endpoint = rawEndpoint.startsWith("http://") || rawEndpoint.startsWith("https://")
    ? rawEndpoint
    : `https://${rawEndpoint}`;

  console.log(`Testing connection to bucket: "${bucket}" at endpoint: "${endpoint}"...`);

  const client = new S3Client({
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    region: process.env.S3_REGION || process.env.AWS_REGION || "auto",
    forcePathStyle: true,
  });

  try {
    // 1. Check bucket access
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
    console.log("✓ Bucket found and accessible with provided credentials!");

    // 2. Test write access
    const testKey = `_test_probe_${Date.now()}.txt`;
    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: testKey,
      Body: "Ashram Gandhi Puri probe test",
      ContentType: "text/plain",
    }));
    console.log(`✓ Write test passed! (Created test object ${testKey})`);

    // 3. Clean up probe object
    await client.send(new DeleteObjectCommand({
      Bucket: bucket,
      Key: testKey,
    }));
    console.log("✓ Delete test passed! (Cleaned up test object)");

    if (publicUrl) {
      console.log(`✓ Public CDN URL configured: ${publicUrl}`);
    }

    console.log("\n=== STORAGE BUCKET IS FULLY WORKING! ===");
  } catch (err: unknown) {
    const error = err as Error;
    console.error("✗ Failed to connect to bucket:", error.message);
    const errObj = err as Record<string, unknown> | null;
    if (errObj && "Code" in errObj) {
      console.error("  Error code:", errObj.Code);
    }
  }
}

await testBucket();

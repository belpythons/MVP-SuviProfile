import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define course image uploader
    courseImageUploader: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1,
        },
    })
        .middleware(async () => {
            // For now, allow unauthenticated uploads
            // In production, you can add auth check here:
            // const session = await auth();
            // if (!session) throw new UploadThingError("Unauthorized");
            return {};
        })
        .onUploadComplete(async ({ file }) => {
            console.log("Upload complete:", file.ufsUrl);
            return { url: file.ufsUrl };
        }),

    // Define testimonial photo uploader
    testimonialPhotoUploader: f({
        image: {
            maxFileSize: "2MB",
            maxFileCount: 1,
        },
    })
        .middleware(async () => {
            return {};
        })
        .onUploadComplete(async ({ file }) => {
            console.log("Testimonial photo uploaded:", file.ufsUrl);
            return { url: file.ufsUrl };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

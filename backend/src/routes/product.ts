import { Router } from "express";
import { isAdmin, isLoggedIn } from "@/middleware/user";
import {
  checkEditImagesValid,
  checkInitImagesValid,
  validateProduct,
} from "@/middleware/product";
import {
  addProduct,
  allProducts,
  deleteProduct,
  findProduct,
  editProduct,
} from "@/controllers/product";
import { productLimit } from "@/utils/limiter";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 7 * 1024 * 1024, files: 5 },
  fileFilter: (req, file, cb) => {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|webp/;

    // Tests if the file types are valid
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype) {
      return cb(null, true);
    } else {
      cb(
        new Error("Error: Images Only! Allowed formats: jpeg, jpg, png, webp"),
      );
    }
  },
});
const router = Router();

router.use(productLimit);

router
  .route("/")
  .post(
    isLoggedIn,
    isAdmin,
    upload.array("images", 5),
    validateProduct,
    checkInitImagesValid,
    addProduct,
  )
  .get(allProducts);

router
  .route("/:id")
  .get(findProduct)
  .delete(isLoggedIn, isAdmin, deleteProduct)
  .put(
    isLoggedIn,
    isAdmin,
    upload.array("images", 5),
    checkEditImagesValid,
    editProduct,
  );

export default router;

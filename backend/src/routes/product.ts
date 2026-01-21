import { Router } from "express";
import { isAdmin, isLoggedIn } from "@/middleware/user";
import { checkInitImagesValid, validateProduct } from "@/middleware/product";
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
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|webp/;
    // Check mime
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

router.post(
  "/",
  isLoggedIn,
  isAdmin,
  validateProduct,
  upload.array("images", 5),
  checkInitImagesValid,
  addProduct,
);
router.get("/", allProducts);
router.get("/:id", findProduct);
router.delete("/:id", isLoggedIn, isAdmin, deleteProduct);
router.put("/:id", isLoggedIn, isAdmin, editProduct);

export default router;

import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  TextField,
  IconButton,
  Stack,
  Divider,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  useMediaQuery,
  useTheme,
  Paper,
  FormHelperText,
  CircularProgress,
  Backdrop,
} from "@mui/material";
import {
  Heading1,
  Heading2,
  ImageIcon,
  Text,
  Send,
  Trash2,
  UploadCloud,
  Eye,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useBlogStore from "../store/useBlogStore.js";
import useAdminStore from "../store/useAdminStore.js";
import { toast } from "react-toastify";

const primaryColor = "#388087";
const lightPrimary = "#5ca8b2";

const blockOptions = [
  { type: "title", label: "H1 Title", icon: <Heading1 size={18} /> },
  { type: "subtitle", label: "H2 Subtitle", icon: <Heading2 size={18} /> },
  { type: "text", label: "Text", icon: <Text size={18} /> },
  { type: "image", label: "Image", icon: <ImageIcon size={18} /> },
];

const blogTypeOptions = [
  "personal",
  "professional",
  "tutorial",
  "review",
  "news",
  "listicle",
  "interview",
  "case-study",
  "travel",
  "food",
  "fitness",
  "tech",
  "lifestyle",
  "education",
  "poetry",
  "business",
  "photo",
  "spiritual",
  "guest",
];

const BlockItem = React.memo(
  ({ item, index, updateValue, removeBlock, handleImage }) => (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 2,
        position: "relative",
        borderRadius: 3,
        border: `1px solid ${lightPrimary}`,
        "&:hover": { boxShadow: 6 },
      }}
    >
      <IconButton
        onClick={() => removeBlock(item.id)}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          bgcolor: "#ffe6e6",
          "&:hover": { bgcolor: "#ffcccc" },
        }}
      >
        <Trash2 size={18} />
      </IconButton>

      {item.type === "image" ? (
        <>
          <Typography fontWeight={600} gutterBottom>
            📷 Image #{index + 1}
          </Typography>
          {item.value && (
            <Box
              component="img"
              src={item.value}
              alt="preview"
              sx={{
                height: 180,
                width: "auto",
                borderRadius: 2,
                border: `1px solid ${lightPrimary}`,
                mb: 2,
                display: "block",
              }}
            />
          )}
          <Box>
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadCloud size={18} />}
              sx={{
                borderColor: primaryColor,
                color: primaryColor,
                textTransform: "none",
              }}
            >
              Choose File
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleImage(item.id, e.target.files[0])}
              />
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Typography fontWeight={600} gutterBottom>
            ✏️ {item.type.charAt(0).toUpperCase() + item.type.slice(1)} #{
              index + 1
            }
          </Typography>
          <TextField
            fullWidth
            multiline={item.type === "text"}
            minRows={item.type === "text" ? 4 : 1}
            placeholder={`Enter ${item.type}`}
            value={item.value}
            onChange={(e) => updateValue(item.id, e.target.value)}
            error={item.value?.trim?.() === ""}
            helperText={
              item.value?.trim?.() === ""
                ? `This ${item.type} field is required.`
                : ""
            }
            sx={{ mt: 1 }}
          />
        </>
      )}
    </Paper>
  )
);

const BlogForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const blogId = location.state?.blogId;
  const restoredContent = location.state?.content;
  const restoredPreviews = location.state?.previews;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const {
    form,
    content,
    images,
    previews,
    selectedBlock,
    typeError,
    setForm,
    setSelectedBlock,
    setTypeError,
    addBlock,
    updateValue,
    handleImage,
    removeBlock,
    resetForm,
    createBlock,
    setPreviews,
  } = useBlogStore();
  const { fetchBlogById, sendForUPdateBLogs } = useAdminStore();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const loadFromLiveView = () => {
      resetForm();
      setForm({ type: form.type || "personal" });
      setPreviews(restoredPreviews || {});
      restoredContent.forEach((block) => {
        const id = block.id || crypto.randomUUID();
        addBlock(block.type, id, block.value || "");
      });
    };

    const fetchBlog = async () => {
      try {
        setFetching(true);
        const res = await fetchBlogById(blogId);
        const { type, content: blocks } = res.data;
        resetForm();
        setForm({ type });
        setSelectedBlock("");
        setTypeError(false);
        blocks.forEach((block) => {
          const id = block._id || crypto.randomUUID();
          addBlock(block.type, id, block.value || "");
        });
      } catch (err) {
        console.error("Error fetching blog:", err);
        toast.error("\u274c Failed to fetch blog.");
      } finally {
        setFetching(false);
      }
    };

    if (restoredContent?.length) loadFromLiveView();
    else if (blogId) fetchBlog();
  }, [blogId, restoredContent]);

  const handleSelectChange = (e) => {
    const type = e.target.value;
    if (!type) return;
    setSelectedBlock(type);
    addBlock(type);
    setSelectedBlock("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.type) {
      setTypeError(true);
      return;
    }

    const formData = new FormData();
    const cleanContent = content.map((item) => {
      if (item.type === "image") {
        if (images[item.id]) return { id: item.id, type: "image" };
        else if (item.value) return { id: item.id, type: "image", value: item.value };
        else return { id: item.id, type: "image" };
      } else {
        return { id: item.id, type: item.type, value: item.value };
      }
    });

    formData.append("type", form.type);
    formData.append("content", JSON.stringify(cleanContent));
    Object.entries(images).forEach(([id, file]) => {
      formData.append("images", file, id);
    });

    try {
      setLoading(true);
      if (blogId) {
        await sendForUPdateBLogs(blogId, formData);
        toast.success("\u2705 Blog updated successfully!");
        setTimeout(() => navigate("/admin"), 500);
      } else {
        await createBlock(formData);
        toast.success("\u2705 Blog created successfully!");
        setTimeout(() => navigate("/admin"), 500);
      }
      resetForm();
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("\u274c Failed to submit blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const hasTitle = content.some((item) => item.type === "title");

  return (
    <>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 2 }} open={fetching}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ py: 5, maxWidth: "1200px", margin: "0 auto" }}>
        <Typography variant={isMobile ? "h5" : "h4"} fontWeight={700} gutterBottom sx={{ mt: isMobile ? 1 : 3, color: primaryColor }}>
          📄 Content Block Builder
        </Typography>
        <Divider sx={{ my: 3, borderColor: lightPrimary }} />
        <FormControl fullWidth error={typeError} required sx={{ mb: 3 }}>
          <InputLabel>Blog Type</InputLabel>
          <Select
            value={form.type}
            onChange={(e) => {
              setForm({ type: e.target.value });
              setTypeError(false);
            }}
            label="Blog Type"
          >
            <MenuItem value="">Select Type</MenuItem>
            {blogTypeOptions.map((type) => (
              <MenuItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </MenuItem>
            ))}
          </Select>
          {typeError && <FormHelperText>Please select a blog type</FormHelperText>}
        </FormControl>
        <Stack spacing={2}>
          {content.map((item, index) => (
            <BlockItem
              key={item.id}
              item={item}
              index={index}
              updateValue={updateValue}
              removeBlock={removeBlock}
              handleImage={handleImage}
            />
          ))}
        </Stack>
        <Box mt={3} textAlign="right">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Add Block</InputLabel>
            <Select
              value={selectedBlock}
              onChange={handleSelectChange}
              label="Add Block"
              IconComponent={() => <span style={{ paddingRight: 8 }}>➕</span>}
            >
              {blockOptions.map((opt) => (
                <MenuItem key={opt.type} value={opt.type} disabled={opt.type !== "title" && !hasTitle}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    {opt.icon}
                    <span>{opt.label}</span>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {content.length > 0 && (
          <Stack direction={isMobile ? "column" : "row"} spacing={2} mt={4}>
            <Button
              fullWidth
              onClick={handleSubmit}
              startIcon={<Send size={20} />}
              variant="contained"
              disabled={loading}
              sx={{
                fontWeight: 600,
                borderRadius: 2,
                bgcolor: primaryColor,
                "&:hover": { bgcolor: lightPrimary },
              }}
            >
              Submit Block
            </Button>
            {!blogId && (
              <Button
                fullWidth
                onClick={() => navigate("/liveview", { state: { content, previews } })}
                startIcon={<Eye size={20} />}
                variant="outlined"
                disabled={loading}
                sx={{
                  fontWeight: 600,
                  borderRadius: 2,
                  bgcolor: "white",
                  color: primaryColor,
                  borderColor: primaryColor,
                  "&:hover": { bgcolor: "#f5f5f5" },
                }}
              >
                Live View
              </Button>
            )}
          </Stack>
        )}
      </Box>
    </>
  );
};

export default BlogForm;

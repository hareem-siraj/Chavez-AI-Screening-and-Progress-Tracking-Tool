import React from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import logo from "../assets/logo.png"; // Logo image
import heroImage from "../assets/heroImage.jpeg"; // Replace with the actual image file name
import { useNavigate, useLocation } from "react-router-dom";

const LandingPageUrdu: React.FC = () => {
  const navigate = useNavigate();

  const location = useLocation();
  
    // Check if the current page is English
    const isUrdu = location.pathname === "/";

  return (
    <Box sx={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingBottom: 4 }}>
      {/* Top Navigation Bar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", padding: "16px", backgroundColor: "#0077b6", color: "white" }}>
        {/* Logo */}
        <Box sx={{ textAlign: "left" }}>
          <img src={logo} alt="Chavez Logo" style={{ width: "150px" }} />
        </Box>

        {/* Language Toggle Button */}
        <Button
          onClick={() => navigate(isUrdu ? "/urdu" : "/")}
          variant="contained"
          sx={{
            backgroundColor: "#ffffff",
            color: "#0077b6",
            textTransform: "none",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            },
          }}
        >
          {isUrdu ? "اردو" : "English"}
        </Button>
      </Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: "#0077b6",
          color: "#ffffff",
          padding: 3,
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Centered Logo */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <img src={logo} alt="Chavez Logo" style={{ width: "200px" }} />
        </Box>

        {/* Sign Up Button */}
        <Box sx={{ position: "absolute", top: 16, right: 16 }}>
          <Button
            onClick={() => navigate("/sign-in-urdu")}
            variant="contained"
            sx={{
              backgroundColor: "#ffffff",
              color: "#0077b6",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              },
            }}
          >
            ابھی سائن ان کریں
          </Button>
        </Box>

        <Typography variant="h4" sx={{ fontWeight: "bold", mt: 4 }}>
          <span style={{ color: "#ffe66d" }}>کلید</span> ابتدائی آٹزم کی تشخیص اور ترقی کی نگرانی کے لیے
        </Typography>
        <Typography variant="subtitle1" sx={{ mt: 2, maxWidth: "600px", mx: "auto" }}>
          جدید، اے آئی سے چلنے والے تشخیصات اور انٹرایکٹو ٹولز جو آپ کے بچے کی ترقی کے ہر مرحلے میں مدد کرتے ہیں۔
        </Typography>

        {/* Hero Image */}
        <Box
          component="img"
          src={heroImage}
          alt="Hero"
          sx={{
            borderRadius: "50%",
            width: "300px",
            height: "300px",
            mt: 4,
            border: "4px solid #ffffff",
          }}
        />
      </Box>

      {/* Changing how autism is diagnosed Section */}
      <Container sx={{ mt: 6 }}>
        <Box
          sx={{
            backgroundColor: "#90e0ef",
            borderRadius: 2,
            padding: 3,
            textAlign: "center",
            color: "#000000",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            آٹزم کی تشخیص کا طریقہ بدل رہے ہیں
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            جب آپ کے بچے کو آٹزم اسپیکٹرم پر ہونے کا سامنا ہوتا ہے، تو چیلنجز اور مایوسیاں بہت زیادہ ہو سکتی ہیں۔
            آپ اپنے بچے کو اپنی پوری صلاحیت تک پہنچنے میں مدد دینے کے لیے ہر ممکن کوشش کرنا چاہتے ہیں۔ لیکن روایتی
            تشخیصات اور وسائل کو نیویگیٹ کرنے میں مہینے، یہاں تک کہ سال لگ سکتے ہیں — یہ وقت جو بہتر ترقی کے لیے استعمال کیا جا سکتا ہے۔
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            یہی وہ جگہ ہے جہاں Chavez آتا ہے۔ ہمارے AI سے چلنے والے، گیمیفائیڈ ٹولز دیکھ بھال کرنے والوں کو ریئل ٹائم بصیرت فراہم کرتے ہیں،
            سمجھ کو عمل میں تبدیل کرتے ہیں اور آج ہر خاندان کو اپنے بچے کی ترقی کی حمایت کرنے میں مدد کرتے ہیں۔
          </Typography>
        </Box>
      </Container>

      {/* Information Cards Section */}
      <Container sx={{ mt: 6 }}>
        <Grid container spacing={4}>
          {/* Card 1 */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                backgroundColor: "#f94144",
                color: "#ffffff",
                borderRadius: 2,
                padding: 3,
                textAlign: "center",
                minHeight: "300px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1.25rem" }}>
                فوری پری ڈائیگنوسس اسکریننگ
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mt: 1,
                  lineHeight: 1.8, // Line spacing
                  fontSize: "1.1rem", // Font size
                }}
              >
                ہمارے تیز اور قابل اعتماد ASD سوالناموں کے ذریعے اپنے بچے کی ترقیاتی پروفائل میں جلد بصیرت حاصل کریں۔
                یہ ماہرین کے ذریعہ ڈیزائن کردہ سوالنامے ASD سے وابستہ کلیدی طرز عمل کا جامع جائزہ فراہم کرتے ہیں۔
              </Typography>
            </Box>
          </Grid>

          {/* Card 2 */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                backgroundColor: "#ffbe0b",
                color: "#000000",
                borderRadius: 2,
                padding: 3,
                textAlign: "center",
                minHeight: "300px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1.25rem" }}>
                گیمیفائیڈ تشخیصات
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mt: 1,
                  lineHeight: 1.8, // Line spacing
                  fontSize: "1.1rem", // Font size
                }}
              >
                ہمارے گیمیفائیڈ تشخیصات کے ذریعے آپ کے بچے کو بامعنی ترقیاتی سرگرمیوں میں شامل کریں۔
                یہ تشخیصات کھیل کو جانچ میں بدل دیتے ہیں، آپ کے بچے کی صلاحیتوں پر قیمتی ڈیٹا حاصل کرتے ہیں۔
              </Typography>
            </Box>
          </Grid>

          {/* Card 3 */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                backgroundColor: "#43aa8b",
                color: "#ffffff",
                borderRadius: 2,
                padding: 3,
                textAlign: "center",
                minHeight: "300px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "1.25rem" }}>
                ترقی کی نگرانی اور حسب ضرورت رپورٹس
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mt: 1,
                  lineHeight: 1.8, // Line spacing
                  fontSize: "1.1rem", // Font size
                }}
              >
                ہمارے ترقی کی نگرانی اور رپورٹنگ ٹول کے ذریعے اپنے بچے کی ترقی کو ٹریک کریں۔
                کسی بھی وقت تفصیلی رپورٹس تیار کریں تاکہ ترقی کی نگرانی کریں اور قیمتی ڈیٹا کو معالجین یا اساتذہ کے ساتھ شیئر کریں۔
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>


      {/* CTA Section */}
      <Container sx={{ mt: 6, textAlign: "center" }}>
        <Button
          onClick={() => navigate("/create-account-urdu")}
          variant="contained"
          sx={{
            backgroundColor: "#0077b6",
            color: "#ffffff",
            textTransform: "none",
            padding: "12px 24px",
            "&:hover": {
              backgroundColor: "#005f8a",
            },
          }}
        >
          ابھی شروع کریں
        </Button>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          width: "100%",
          padding: 3,
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          color: "#888888",
          mt: 6,
        }}
      >
        <Typography variant="body2">کمپنی</Typography>
        <Typography variant="body2">ہمارے بارے میں</Typography>
        <Typography variant="body2">ٹیم</Typography>
        <Typography variant="body2">حل</Typography>
        <Typography variant="body2">سیکیورٹی</Typography>
      </Box>
    </Box>
  );
};

export default LandingPageUrdu;

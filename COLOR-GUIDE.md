# 🎨 CricketXpert Color Palette Guide

## 🏏 **Professional Cricket Equipment Repair System Colors**

### **Main Brand Colors**

#### **Primary Color (Main Theme)**
- **Hex:** `#072679` (Dark Navy)
- **Usage:** Main brand color, professional, sporty, trustworthy
- **CSS Variable:** `var(--primary)`
- **Tailwind Class:** `text-[#072679]` or `bg-[#072679]`

#### **Secondary Accent**
- **Hex:** `#42ADF5` (Sky Blue)
- **Usage:** Fresh, energetic, works well for sports
- **CSS Variable:** `var(--secondary)`
- **Tailwind Class:** `text-[#42ADF5]` or `bg-[#42ADF5]`

### **Font Colors**

#### **Headings**
- **Hex:** `#000000` (Black)
- **Usage:** Strong readability for headings
- **CSS Variable:** `var(--heading)`
- **Tailwind Class:** `text-black`

#### **Body Text**
- **Hex:** `#36516C` (Steel Blue)
- **Usage:** Softer reading experience for body text
- **CSS Variable:** `var(--body)`
- **Tailwind Class:** `text-[#36516C]`

#### **Light Text (On Dark Backgrounds)**
- **Hex:** `#F1F2F7` (Light Gray/White)
- **Usage:** High contrast on dark backgrounds
- **CSS Variable:** `var(--light-text)`
- **Tailwind Class:** `text-[#F1F2F7]`

### **Button Colors**

#### **Primary Buttons**
- **Hex:** `#42ADF5` (Sky Blue)
- **Usage:** "Sign Up", "Book Session", main actions
- **CSS Variable:** `var(--btn-primary)`
- **Hover State:** `#2C8ED1` (Slightly darker blue)
- **CSS Variable:** `var(--btn-primary-hover)`

#### **Secondary Buttons**
- **Hex:** `#D88717` (Orange-Brown)
- **Usage:** "Learn More", sporty call-to-action feel
- **CSS Variable:** `var(--btn-secondary)`

### **Background Colors**

#### **Main Background**
- **Hex:** `#F1F2F7` (Light Gray)
- **Usage:** Clean, minimal main background
- **CSS Variable:** `var(--bg-main)`
- **Tailwind Class:** `bg-[#F1F2F7]`

#### **White Background**
- **Hex:** `#FFFFFF` (Pure White)
- **Usage:** Cards, sections, highlights
- **CSS Variable:** `var(--bg-white)`
- **Tailwind Class:** `bg-white`

## 🎯 **Usage Examples**

### **Navigation Bar**
```css
nav {
  background-color: #FFFFFF;
  border-bottom: 2px solid #42ADF5;
}

.logo {
  color: #072679;
}

.nav-link {
  color: #36516C;
}

.nav-link.active {
  background-color: #42ADF5;
  color: #F1F2F7;
}
```

### **Buttons**
```css
.btn-primary {
  background-color: #42ADF5;
  color: #F1F2F7;
}

.btn-secondary {
  background-color: #D88717;
  color: #F1F2F7;
}
```

### **Cards**
```css
.card {
  background-color: #FFFFFF;
  border: 1px solid #E5E7EB;
}

.card-title {
  color: #000000;
}

.card-text {
  color: #36516C;
}
```

### **Status Indicators**
```css
.status-success {
  color: #10B981; /* Green */
}

.status-warning {
  color: #F59E0B; /* Amber */
}

.status-error {
  color: #EF4444; /* Red */
}
```

## 📱 **Component Color Mapping**

### **Header/Navigation**
- Background: `#FFFFFF`
- Logo: `#072679`
- Active Link: `#42ADF5` with `#F1F2F7` text
- Inactive Links: `#36516C`

### **Main Content**
- Background: `#F1F2F7`
- Headings: `#000000`
- Body Text: `#36516C`
- Cards: `#FFFFFF`

### **Buttons**
- Primary Actions: `#42ADF5` with `#F1F2F7` text
- Secondary Actions: `#D88717` with `#F1F2F7` text
- Hover States: Slightly darker versions

### **Status & Alerts**
- Success: Green (`#10B981`)
- Warning: Amber (`#F59E0B`)
- Error: Red (`#EF4444`)
- Info: `#42ADF5`

## 🎨 **Design Principles**

1. **Professional & Sporty:** Dark navy conveys professionalism, sky blue adds energy
2. **High Contrast:** Black headings ensure readability
3. **Soft Reading:** Steel blue body text reduces eye strain
4. **Clear Hierarchy:** Color differences create visual hierarchy
5. **Consistent Branding:** All colors work together cohesively

## 🔧 **Implementation**

### **CSS Variables (Recommended)**
```css
:root {
  --primary: #072679;
  --secondary: #42ADF5;
  --heading: #000000;
  --body: #36516C;
  --light-text: #F1F2F7;
  --btn-primary: #42ADF5;
  --btn-secondary: #D88717;
  --bg-main: #F1F2F7;
  --bg-white: #FFFFFF;
}
```

### **Tailwind Classes**
```html
<div class="bg-[#F1F2F7] text-[#36516C]">
  <h1 class="text-[#072679]">Title</h1>
  <button class="bg-[#42ADF5] text-[#F1F2F7]">Action</button>
</div>
```

---

**🏏 CricketXpert - Professional Color Palette for Cricket Equipment Repair System**

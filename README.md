# 📚 Magical Library — Thư Viện Cổ Tích Việt Nam

Thư viện 3D tương tác chứa các truyện cổ tích dân gian Việt Nam, được xây dựng bằng Next.js và Three.js.

## ✨ Tính năng

- 🌌 **150 cuốn sách 3D** nổi trong không gian huyền ảo
- 🔍 **Tìm kiếm** theo tên truyện
- 🏷️ **Lọc theo thể loại** (Thần thoại, Cổ tích, Truyền thuyết...)
- 📖 **Chế độ đọc** với hiệu ứng lật trang
- 🎵 **Nhạc nền** Dance of the Sugar Plum Fairy (Tchaikovsky)
- 🎆 **Hiệu ứng bloom, depth-of-field, aura sách**

## 🚀 Chạy dự án

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

## 🛠️ Công nghệ

| Thư viện | Mục đích |
|---|---|
| Next.js 16 | Framework |
| Three.js + R3F | Render 3D |
| @react-three/drei | Helpers 3D |
| @react-three/postprocessing | Bloom, DoF |
| Zustand | State management |
| GSAP | Animation |

## 🎮 Cách dùng

1. Bấm **Bắt Đầu** để vào thư viện
2. **Kéo** để xoay góc nhìn, **cuộn** để zoom
3. **Hover** vào sách để xem tên, **click** để mở đọc
4. Zoom gần → sách xếp thành **hình cầu Fibonacci**

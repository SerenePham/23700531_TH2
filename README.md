# PHAM THANH BINH · 23700531 · https://github.com/SerenePham/23700531_TH2.git · #926184 · Số cuối: 1 · VARIANT: Watermark Dưới, Login phone, Tab Shop→Giỏ→Tôi, Haptic selection, Phí B, Detail card

# KTXGo — Dịch Vụ Giao Đồ Tận Phòng Ký Túc Xá (TH2)

Ứng dụng di động KTXGo được phát triển bằng **React Native CLI + TypeScript** phục vụ bài thi thực hành TH2.

---

## 1. Thông Tin Sinh Viên & Biến Thể Đề Thi

| Thông tin | Giá trị |
| :--- | :--- |
| **Họ và tên** | **PHAM THANH BINH** |
| **MSSV** | **23700531** |
| **Chữ số cuối MSSV** | **1** |
| **Exam Stamp** | **#926184** (`examStamp()` = `TH2|23700531|PHAM THANH BINH`) |
| **Vị trí Watermark** | **Dưới** (`LAST_DIGIT % 2 !== 0`) |
| **Ô Login** | **phone** (`VARIANT.authField = 'phone'`) |
| **Thứ tự Tab** | **Shop → Giỏ → Tôi** (`shopFirst`) |
| **Haptic khi thêm giỏ** | **selection** (`VARIANT.hapticOnAdd = 'selection'`) |
| **Công thức phí ship** | **B** (`BASE_SHIP_FEE + Math.round(km * 1500) + 2000`) |
| **Kiểu chi tiết món (Detail)** | **card** (`VARIANT.detailPresentation = 'card'`) |
| **Phòng giao KTX** | **P.231** (`ROOM_LABEL`) |
| **Base Ship Fee** | **9.000 đ** (`BASE_SHIP_FEE`) |
| **Price Multiplier** | **20.500** (`PRICE_MULTIPLIER`) |
| **Debounce** | **400 ms** (`DEBOUNCE_MS`) |
| **Stale Time** | **21.000 ms** (`STALE_TIME_MS`) |
| **HTTPS Clone URL** | `https://github.com/SerenePham/23700531_TH2.git` |

---

## 2. Cây Thư Mục Bắt Buộc

Dự án tuân thủ nghiêm ngặt cấu trúc cây thư mục và alias:

```
KTXGo_23700531/
├── README.md
├── App.tsx
├── package.json
├── babel.config.js
├── tsconfig.json
├── docs/
│   ├── screenshot-th2-home.png
│   └── screenshot-th2-cart.png
└── src/
    ├── constants/student.ts
    ├── constants/theme.ts
    ├── hooks/useDebouncedValue.ts
    ├── hooks/useCampusLocation.ts
    ├── services/apiClient.ts
    ├── services/productApi.ts
    ├── stores/authStore.ts
    ├── stores/cartStore.ts
    ├── navigation/RootNavigator.tsx
    ├── navigation/AuthStack.tsx
    ├── navigation/MainTabs.tsx
    ├── navigation/ShopStack.tsx
    ├── components/ProductCard.tsx
    ├── components/Watermark.tsx
    ├── screens/
    │   ├── LoginScreen.tsx
    │   ├── HomeScreen.tsx
    │   ├── DetailScreen.tsx
    │   ├── CartScreen.tsx
    │   └── MeScreen.tsx
    └── utils/
        └── haptics.ts
```

Alias được cấu hình trong `babel.config.js` và `tsconfig.json`:
- `@screens`, `@components`, `@constants`, `@services`, `@stores`, `@hooks`, `@navigation`, `@utils`

---

## 3. Kiến Trúc & Công Nghệ Triển Khai

1. **Navigation (React Navigation v7)**:
   - `RootNavigator` điều phối giữa `AuthStack` (khi chưa có token) và `MainTabs` (khi đã đăng nhập).
   - `AuthStack`: `LoginScreen` với ô nhập số điện thoại (`phone`). Khi đăng nhập lưu token giả `ktxgo-23700531-926184`.
   - `MainTabs`: Tab bar 3 tab với thứ tự `Cửa hàng` → `Giỏ` → `Tôi`. Badge trên tab Giỏ phản ánh tổng số lượng món từ Zustand (ẩn khi = 0).
   - `ShopStack`: Chứa `HomeScreen` và `DetailScreen` (trình bày dạng `card`).

2. **Giao Diện Cửa Hàng & React Query (FlashList 2 cột)**:
   - Dùng `@shopify/flash-list` với `numColumns={2}`, `keyExtractor` ghép MSSV: `${STUDENT.mssv}-${item.id}`.
   - Quản lý dữ liệu qua `@tanstack/react-query` + `axios` (`apiClient.ts` gắn interceptor header `X-Student-Id: 23700531`).
   - Xử lý đủ 3 cảnh mạng:
     - **Đang tải**: ActivityIndicator + text "Đang tải món...".
     - **Có dữ liệu**: Hiển thị lưới sản phẩm 2 cột.
     - **Lỗi mạng**: Hiển thị MSSV `23700531` màu đỏ, thông báo lỗi và nút "Thử lại" gọi `refetch()`.
   - Tìm kiếm controlled có debounce thời gian `DEBOUNCE_MS = 400ms`.
   - Hỗ trợ Pull-to-refresh cập nhật danh sách.

3. **Zustand + Persist Giỏ Hàng & Haptic**:
   - `cartStore`: `add`, `remove`, `changeQty`, `totalQuantity`, `totalAmount`.
   - Persist giỏ hàng vào `AsyncStorage` với key `ktxgo-cart-23700531`.
   - Thêm vào giỏ từ nút `+` ở Home hoặc nút ở Detail đều cập nhật cùng store và phát rung `selection` theo đúng biến thể.
   - Màn hình Detail hiển thị `Alert` có chứa MSSV `23700531`.
   - Màn hình Cart hiển thị số lượng, nút xóa, tổng tiền, phòng giao `P.231`, và phí ship theo vị trí GPS.

4. **GPS / Location & Ước Tính Phí Ship**:
   - `useCampusLocation`: Xử lý đầy đủ 3 nhánh quyền (`granted`, `denied`, `blocked`). Khi `blocked` hỗ trợ `Linking.openSettings()`.
   - Tính khoảng cách đường chim bay đến cổng KTX bằng công thức **Haversine**.
   - Tính phí ship theo **công thức B**: `BASE_SHIP_FEE + Math.round(km * 1500) + 2000`. Với khoảng cách ~1.2 km, phí ship ước tính là `12.800 đ`.
   - Phí ship đồng bộ giữa tab Tôi và tab Giỏ.

---

## 4. Hướng Dẫn Cài Đặt & Khởi Chạy

```bash
# 1. Cài đặt dependencies
npm install

# 2. Khởi chạy Metro Bundler
npm start

# 3. Chạy trên Android
npm run android

# 4. Kiểm tra TypeScript
npx tsc --noEmit
```

---

## 5. Ảnh Chụp Màn Hình (Screenshots)

### Màn hình Cửa hàng (Home)
![Home Screenshot](docs/screenshot-th2-home.png)

### Màn hình Giỏ hàng (Cart)
![Cart Screenshot](docs/screenshot-th2-cart.png)

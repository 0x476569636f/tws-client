export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Category {
  id: number;
  namaKategori: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsItem {
  id: number;
  judul: string;
  isi: string;
  image: string;
  kategoriId: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user: User;
  kategori: Category;
}

export interface NewsDetail {
  id: number;
  judul: string;
  isi: string;
  image: string;
  createdAt: string;
  kategori: {
    namaKategori: string;
  };
  user: {
    name: string;
  };
}

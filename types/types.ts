export type Eczane = {
  isim: string,
  adres: string,
  acilis_saati: string,
  kapanis_saati: string,
  telefon_no: string,
  yonetici_id: string,
  eczane_id: string
}

export type Kisi = {
  tc_no: string,
  ad: string,
  soyad: string,
  adres: string
}

export type Urun = {
  urun_id: string,
  urun_turu: string,
  urun_adı: string
}

export type Kullanici = {
  user_id: string,
  kullanici_adi: string,
  parola: string,
  yetki: string
}

export type Calisan = {
  eczane_id: string,
  isim: string,
  tc_no: string,
  maas: number,
  pozisyon: string,
  ise_giris_tarihi: string
}

export type Satis = {
  eczane_id: string,
  urun_id: string,
  satilma_tarihi: string
}

export type Stok = {
  eczane_id: string,
  urun_id: string,
  adet: number,
  isim: string,
  urun_adı: string
}
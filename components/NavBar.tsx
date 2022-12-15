import Link from "next/link"

export default function NavBar() {

  return (
    <nav className="nav">
      <ul>
        <li>
          <Link href="/" className=""> Ana Sayfa </Link>
        </li>
        <li>
          <Link href="/eczane" className=""> Eczane Listesi </Link>
        </li>
        <li>
          <Link href="/urun" className=""> Ürün Listesi </Link>
        </li>
        <li>
          <Link href="/stok" className=""> Stoklar </Link>
        </li>
        <li>
          <Link href="/kisi" className=""> Kişiler </Link>
        </li>
        <li>
          <Link href="/kullanici" className=""> Kullanıcılar </Link>
        </li>
        <li>
          <Link href="/calisan" className=""> Çalışanlar </Link>
        </li>
        <li>
          <Link href="/register" className=""> Register </Link>
        </li>
        <li>
          <Link href="/login" className=""> Login </Link>
        </li>
      </ul>
    </nav>
  )
}
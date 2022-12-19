import axios from "axios";
import Link from "next/link";
import { NextRouter, useRouter } from "next/router";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [user_id, setUserID] = useState<undefined | null | string>(null);
  const [yetki, setYetki] = useState<undefined | null | string>(null);

  const router: NextRouter = useRouter();

  useEffect(() => {
    setUserID(localStorage.getItem("user_id"));
    setYetki(localStorage.getItem("yetki"));

  }, [router.pathname]);

  const logout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("yetki");
    router.push("/login");
  }

  return (
    <nav className="nav">
      <ul className="nav-ul">
        <li>
          <Link href="/" className=""> Ana Sayfa </Link>
        </li>

        {user_id === null ? (
          <>
            {router.pathname !== "/login" ? (
              <li>
                <Link href="/login" className=""> Login </Link>
              </li>
            ) : null}
            {router.pathname !== "/register" ? (
              <li>
                <Link href="/register" className=""> Register </Link>
              </li>
            ) : null}
          </>
        ) : (
          <>
            {yetki == 'admin' || yetki == 'yonetici'
              ? <>
                <li>
                  <Link href="/eczane" className=""> Eczaneler </Link>
                </li>
                <li>
                  <Link href="/urun" className=""> Ürünler </Link>
                </li>
                <li>
                  <Link href="/kisi" className=""> Kişiler </Link>
                </li>
                <li>
                  <Link href="/calisan" className=""> Çalışanlar </Link>
                </li>
              </>

              : null}
            {yetki == 'admin'
              ? <>
                <li>
                  <Link href="/kullanici" className=""> Kullanıcılar </Link>
                </li>
              </>

              : null}

            {yetki == 'admin' || yetki == 'yonetici' || yetki == 'kullanici'
              ? <>
                <li>
                  <Link href="/stok" className=""> Stoklar </Link>
                </li>
                <li>
                  <Link href="/satis" className=""> Satışlar </Link>
                </li>
              </>
              : null}

          </>
        )}
        <li className="logout">
          <Button
            label="Çıkış Yap"
            className="p-button-danger"
            onClick={() => logout()}
          />
        </li>
      </ul>
    </nav>
  );
}

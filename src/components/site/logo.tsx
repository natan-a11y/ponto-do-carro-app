import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <Image
        src="https://i.postimg.cc/wx0fK0C0/PDC-marca-RGB-final-sem-o-br-1.png"
        alt="Ponto do Carro Logo"
        width={160}
        height={38}
        priority
      />
    </Link>
  );
}

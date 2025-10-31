import Link from "next/link";
import Image from "next/image";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <Image
        src="https://pontodocarro.com.br/wp-content/uploads/2023/10/PDC_marca_RGB_final_sem_o_br.png"
        alt="Ponto do Carro Logo"
        width={160}
        height={38}
        priority
      />
    </Link>
  );
}

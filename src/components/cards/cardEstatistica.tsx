import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ReactNode } from "react";

interface CardEstatisticaProps {
  title: string;
  description: string;
  valor: number | string;
  icon: ReactNode;
  color?: string; // cor opcional
  link?: string;  // link opcional
}

export function CardEstatistica({ title, description, valor, icon, color = "text-gray-800", link }: CardEstatisticaProps) {
  const Conteudo = (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-center">
          <CardTitle className={`text-lg sm:text-xl ${color} select-none`}>
            {title}
          </CardTitle>
          <div className="ml-auto w-4 h-4">{icon}</div>
        </div>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex justify-end">
        <p className={`text-base sm:text-lg font-bold ${color}`}>
          {valor}
        </p>
      </CardContent>
    </Card>
  );

  return link ? <Link href={link}>{Conteudo}</Link> : Conteudo;
}

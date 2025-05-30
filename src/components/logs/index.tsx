import { FileClock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function Sales() {
 return (
   <Card className="flex-1">
    <CardHeader>
      <div className="flex items-center justify-center">
        <CardTitle className="text-lg sm:text-xl text-gray-800">
          Logs
        </CardTitle>
        <FileClock className="ml-auto w-4 h-4"/>
      </div>
      <CardDescription>
      Logs do sistema
    </CardDescription>
    </CardHeader>
    <CardContent>
      <article className="flex items-center gap-2 border-b py-2">
        <Avatar className="w-8 h-8">
          <AvatarImage src="https://github.com/joaomaxdev.png" />
          <AvatarFallback>JMD</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm sm:text-base font-semibold">Joao</p>
          <span className="text-[12px] sm:text-sm text-gray-400">novo cpe add</span>
        </div>
      </article>  
      <article className="flex items-center gap-2 border-b py-2">
        <Avatar className="w-8 h-8">
          <AvatarImage src="https://github.com/joaomaxdev.png" />
          <AvatarFallback>JMD</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm sm:text-base font-semibold">Joao</p>
          <span className="text-[12px] sm:text-sm text-gray-400">novo cpe add</span>
        </div>
      </article>
      <article className="flex items-center gap-2 border-b py-2">
        <Avatar className="w-8 h-8">
          <AvatarImage src="https://github.com/joaomaxdev.png" />
          <AvatarFallback>JMD</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm sm:text-base font-semibold">Joao</p>
          <span className="text-[12px] sm:text-sm text-gray-400">novo cpe add</span>
        </div>
      </article>
    </CardContent>
   </Card>
 );
}
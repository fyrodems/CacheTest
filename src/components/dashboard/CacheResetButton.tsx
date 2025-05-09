// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { toast } from "sonner";

// interface CacheResetButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   isResetting?: boolean;
//   children?: React.ReactNode;
// }

// const CacheResetButton: React.FC<CacheResetButtonProps> = ({
//   children,
//   className,
//   ...props
// }) => {
//   const [isResetting, setIsResetting] = useState(false);

//   const handleCacheReset = async () => {
//     try {
//       setIsResetting(true);
//       // Wywołanie API do czyszczenia cache
//       const response = await fetch("/api/cache/reset", {
//         method: "POST",
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       toast.success("Cache został wyczyszczony pomyślnie");
//     } catch (error) {
//       console.error("Error resetting cache:", error);
//       toast.error(
//         error instanceof Error
//           ? `Błąd podczas czyszczenia cache: ${error.message}`
//           : "Nieznany błąd podczas czyszczenia cache",
//       );
//     } finally {
//       setIsResetting(false);
//     }
//   };

//   return (
//     <AlertDialog>
//       <AlertDialogTrigger asChild>
//         <Button
//           variant="destructive"
//           className={className}
//           disabled={isResetting}
//           {...props}
//         >
//           {isResetting ? "Czyszczenie..." : children}
//         </Button>
//       </AlertDialogTrigger>
//       <AlertDialogContent>
//         <AlertDialogHeader>
//           <AlertDialogTitle>
//             Czy na pewno chcesz wyczyścić cache?
//           </AlertDialogTitle>
//           <AlertDialogDescription>
//             Spowoduje to usunięcie wszystkich zbuforowanych zasobów i danych, co
//             może wpłynąć na wydajność aplikacji do momentu ponownego zbudowania
//             cache.
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter>
//           <AlertDialogCancel>Anuluj</AlertDialogCancel>
//           <AlertDialogAction onClick={handleCacheReset}>
//             Kontynuuj
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// };

// export default CacheResetButton;

import { Button } from "./button";

const Navbar = () => {
  return (
    <nav className="px-[7%] py-5 flex justify-between items-center fixed top-0 right-0 left-0 bg-white">
      <div className="flex gap-2 items-center">
        <img src="logo.png" alt="" width={40} />
        <h1 className="font-bold text-3xl text-foreground">Infrastar</h1>
      </div>
      <div className="text-foreground flex gap-6 text-lg font-semibold">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Feature</a>
      </div>
      <div className="space-x-2">
        <Button className="text-lg">Masuk</Button>
        <Button className="bg-white text-primary border border-primary hover:text-white text-lg">Daftar</Button>
      </div>
    </nav>
  );
};

export default Navbar;

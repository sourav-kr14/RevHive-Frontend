function Logo() {
  return (
    <div className="h-14 w-14 rounded-2xl bg-white/5 backdrop-blur-md flex items-center justify-center overflow-hidden shadow-md hover:scale-105 transition-transform duration-300">
      <img
        src="logo.png"
        alt="RevHive Logo"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export default Logo;

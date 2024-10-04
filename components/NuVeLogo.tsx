const NuVeLogo = () => {
    return (
      <div className="flex items-end" style={{ userSelect: 'none' }}>
        <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl">
          Nu-Ve
        </h1>
        <span className="ml-2 text-sm text-muted-foreground"> {/* Added margin-left for spacing */}
          ai assistant
        </span>
      </div>
    );
  };
  
  export default NuVeLogo;
type ModalProps = {
  aberto: boolean;
  fechar: () => void;
  children: React.ReactNode;
  titulo: string;
};

export default function Modal({
  aberto,
  fechar,
  children,
  titulo,
}: ModalProps) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {titulo}
          </h2>

          <button
            onClick={fechar}
            className="text-red-600 text-xl"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
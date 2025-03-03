export default function NotAvailable() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-red-500">Módulo Desactivado</h1>
      <p className="mt-4">Este módulo está temporalmente desactivado para priorizar el desarrollo de Case Studies y CMS.</p>
      <a href="/admin" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded">
        Volver al Panel Principal
      </a>
    </div>
  );
}
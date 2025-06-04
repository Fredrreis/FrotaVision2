export function formatarCNPJ(valor: string) {
  if (!valor) return '';
  
  const cnpjLimpo = valor.replace(/\D/g, '');
  
  return cnpjLimpo
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18);
}

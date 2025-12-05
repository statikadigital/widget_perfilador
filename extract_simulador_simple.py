import re

# Leer el archivo
with open('simulador.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extraer sección
section_match = re.search(r'<section class="perfil ">.*?</section>', content, re.DOTALL)
if section_match:
    section = section_match.group(0).replace('id="myChart0"', 'id="myChart"')
else:
    print('ERROR: No se encontró la sección')
    section = ''

# Extraer estilos - buscar desde la línea 1296
styles_start = content.find('<style media="screen" type="text/css">', content.find('.perfil {'))
if styles_start != -1:
    styles_end = content.find('</style>', styles_start) + 8
    styles = content[styles_start:styles_end]
else:
    print('ERROR: No se encontraron estilos')
    styles = ''

# Extraer script
script_match = re.search(r'<script>\s*\(\(\) => \{.*?\}\)\(\);\s*</script>', content, re.DOTALL)
if script_match:
    script = script_match.group(0)
else:
    print('ERROR: No se encontró el script')
    script = ''

# Construir HTML completo
html = f'''<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simulador - Sección Perfil</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />
{styles}
</head>
<body>
{section}
<script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>
{script}
</body>
</html>'''

# Guardar archivo
with open('simulador_perfil_extracto.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Archivo creado exitosamente: simulador_perfil_extracto.html')


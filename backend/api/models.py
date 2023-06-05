from django.db import models
from pygments.lexers import get_all_lexers
from pygments.styles import get_all_styles

LEXERS = [item for item in get_all_lexers() if item[1]]
LANGUAGE_CHOICES = sorted([(item[1][0], item[0]) for item in LEXERS])
STYLE_CHOICES = sorted([(item, item) for item in get_all_styles()])

class Telemetria(models.Model):
    tipo = models.CharField(max_length=10)
    captura_data_hora = models.DateTimeField()
    registro_data_hora = models.DateTimeField()
    envio_tentativa_data_hora = models.DateTimeField()
    envio_data_hora = models.DateTimeField()
    placa = models.CharField(max_length=255)
    placa_tipo = models.CharField(max_length=25)
    placa_totalmente_reconhecida = models.BooleanField()
    sentido = models.CharField(max_length=255)
    camera_nome = models.CharField(max_length=255)
    camera_codigo = models.CharField(max_length=255)
    veiculo_tipo = models.CharField(max_length=50)
    veiculo_cor = models.CharField(max_length=50)
    velocidade = models.CharField(max_length=50)
    faixa = models.CharField(max_length=10)
    ultimo_enviado_id = models.IntegerField()
    arquivo_nome = models.CharField(max_length=255)
    status_cpu = models.TextField()
    status_ram = models.TextField()
    status_disco = models.TextField()
    status_rede = models.TextField()
    ping_sefaz = models.BooleanField()
    ping_camera = models.BooleanField()
    camera_latitude = models.CharField(max_length=255)
    camera_longitude = models.CharField(max_length=255)
    camera_endereco = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
            ordering = ['created_at']
            db_table = 'telemetrias'



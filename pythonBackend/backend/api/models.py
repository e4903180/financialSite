from django.db import models

# Create your models here.
class Ahe(models.Model):
    date = models.CharField(max_length = 50)
    ahe = models.FloatField()


class Cpi(models.Model):
    date = models.CharField(max_length = 50)
    cpi = models.FloatField()

class Dxy(models.Model):
    date = models.CharField(max_length = 50)
    close = models.FloatField()

class Fed(models.Model):
    date = models.CharField(max_length = 50)
    fed = models.FloatField()

class Jnk(models.Model):
    date = models.CharField(max_length = 50)
    close = models.FloatField()

class Pce(models.Model):
    date = models.CharField(max_length = 50)
    pce = models.FloatField()

class Ppi(models.Model):
    date = models.CharField(max_length = 50)
    ppi = models.FloatField()

class Rpceg(models.Model):
    date = models.CharField(max_length = 50)
    rpceg = models.FloatField()

class TWII(models.Model):
    date = models.CharField(max_length = 50)
    twii = models.FloatField()

class UMCS(models.Model):
    date = models.CharField(max_length = 50)
    umcs = models.FloatField()
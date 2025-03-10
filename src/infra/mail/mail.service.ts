import { Injectable } from '@nestjs/common'
import { createTransport, Transporter, createTestAccount } from 'nodemailer'
import { EnvService } from '../env/env.service'

interface SendMailParams {
  to: {
    name: string
    address: string
  }
  from: {
    name: string
    address: string
  }
  link?: string
  subject?: string
  text?: string
  html?: string
}

@Injectable()
export class MailService {
  private transporter: Transporter

  constructor(private envService: EnvService) {
    this.createTransporter()
  }

  async createTransporter(): Promise<void> {
    const account = await createTestAccount()

    this.transporter = createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    })
  }

  async sendMail({ to, from, html, text, subject }: SendMailParams) {
    const message = await this.transporter.sendMail({
      to,
      from,
      subject,
      text,
      html,
    })

    return message
  }

  async sendAccountConfirmationEmail({ to, from, link }: SendMailParams) {
    const subject = 'Confirme seu endereço de e-mail'
    const html = `
      <h1>Bem-vindo(a) ao nosso ecommerce, ${to.name}!</h1>
      <p>Sua conta foi criada com sucesso.</p>
      <p>Obrigado por se cadastrar em nossa plataforma.</p>
      <p>Para ativar sua conta, clique no link abaixo:</p>
      <a href="${link}">Ativar conta</a>
    `

    const message = await this.sendMail({ to, from, subject, html })

    return message
  }
}

<?php

namespace App\Mail;

use App\Models\AgentEnquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AgentEnquirySubmitted extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public AgentEnquiry $enquiry) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: sprintf('New Agent Enquiry: %s', $this->enquiry->name),
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.agent-enquiry-submitted',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}

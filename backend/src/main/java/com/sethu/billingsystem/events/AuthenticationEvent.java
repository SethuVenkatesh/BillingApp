package com.sethu.billingsystem.events;


import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AbstractAuthenticationFailureEvent;
import org.springframework.security.authentication.event.AuthenticationSuccessEvent;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class AuthenticationEvent {

    @EventListener
    private void onSucess (AuthenticationSuccessEvent auth){
        log.info("Authentication Success for the user {}" ,auth.getAuthentication().getName());
    }

    @EventListener
    private void onFailure(AbstractAuthenticationFailureEvent auth){
        log.error("Authntication failed for the username {} due to error {} ",auth.getAuthentication().getName(),auth.getException().getMessage());
    }

}

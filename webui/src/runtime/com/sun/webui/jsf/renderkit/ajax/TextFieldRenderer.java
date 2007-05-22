/*
 * The contents of this file are subject to the terms
 * of the Common Development and Distribution License
 * (the License).  You may not use this file except in
 * compliance with the License.
 *
 * You can obtain a copy of the license at
 * https://woodstock.dev.java.net/public/CDDLv1.0.html.
 * See the License for the specific language governing
 * permissions and limitations under the License.
 *
 * When distributing Covered Code, include this CDDL
 * Header Notice in each file and include the License file
 * at https://woodstock.dev.java.net/public/CDDLv1.0.html.
 * If applicable, add the following below the CDDL Header,
 * with the fields enclosed by brackets [] replaced by
 * you own identifying information:
 * "Portions Copyrighted [year] [name of copyright owner]"
 *
 * Copyright 2007 Sun Microsystems, Inc. All rights reserved.
 */
package com.sun.webui.jsf.renderkit.ajax;

import com.sun.faces.annotation.Renderer;
import com.sun.webui.jsf.component.TextField;
import com.sun.webui.jsf.util.ComponentUtilities;

import java.io.IOException;
import java.util.Iterator;
import java.util.Map;

import javax.faces.application.FacesMessage;
import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * This class responds to Ajax requests made to ProgressBar components.
 */
@Renderer(@Renderer.Renders(
rendererType="com.sun.webui.jsf.ajax.TextField",
        componentFamily="com.sun.webui.jsf.TextField"))
        public class TextFieldRenderer
        extends com.sun.webui.jsf.renderkit.widget.TextFieldRenderer  {
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Renderer methods
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    
    /**
     * Render the beginning of the specified UIComponent to the output stream or
     * writer associated with the response we are creating.
     *
     * @param context FacesContext for the current request.
     * @param component UIComponent to be rendered.
     *
     * @exception IOException if an input/output error occurs.
     * @exception NullPointerException if context or component is null.
     */
    public void encodeBegin(FacesContext context, UIComponent component) {
        // Do nothing...
    }
    
    /**
     * Render the children of the specified UIComponent to the output stream or
     * writer associated with the response we are creating.
     *
     * @param context FacesContext for the current request.
     * @param component UIComponent to be rendered.
     *
     * @exception IOException if an input/output error occurs.
     * @exception NullPointerException if context or component is null.
     */
    public void encodeChildren(FacesContext context, UIComponent component)
    throws IOException {
        if (context == null || component == null) {
            throw new NullPointerException();
        }
        
        // Output component properties if Ajax request and is refresh or submit event.
        if (ComponentUtilities.isAjaxRequest(context, component, "refresh") ) {
            super.encodeChildren(context, component);
        }
                
        // Return if Ajax request and is not validate event.
        // "submit" request would return here
        if (ComponentUtilities.isAjaxRequest(context, component, "validate") ||
            ComponentUtilities.isAjaxRequest(context, component, "submit")                
                ) {            
            try {
                boolean valid = ((TextField) component).isValid();
                JSONObject json = new JSONObject();
                json.put("valid", valid);
                json.put("id", component.getClientId(context));
                
                if (!valid) {
                    Iterator msgs = context.getMessages(component.getClientId(context));
                    if (msgs.hasNext()) {
                        FacesMessage msg = (FacesMessage) msgs.next();
                        json.put("detail", msg.getDetail());
                        json.put("summary", msg.getSummary());
                        json.put("severity", msg.getSeverity());
                    }
                }
                json.write(context.getResponseWriter());
            } catch(JSONException e) {
                e.printStackTrace();
            }
            return;
        }
        
    }
    
    /**
     * Render the ending of the specified UIComponent to the output stream or
     * writer associated with the response we are creating.
     *
     * @param context FacesContext for the current request.
     * @param component UIComponent to be rendered.
     *
     * @exception IOException if an input/output error occurs.
     * @exception NullPointerException if context or component is null.
     */
    public void encodeEnd(FacesContext context, UIComponent component) {
        // Do nothing...
    }
}
